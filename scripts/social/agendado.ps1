# Roda o robô do Instagram neste computador e guarda o log em social/logs/.
# Chamado pelas tarefas do Agendador (agendar.ps1) ou à mão:
#   powershell -ExecutionPolicy Bypass -File scripts\social\agendado.ps1 -Formato carrossel [-Dry] [-Force] [-ComIA] [-ForaDaJanela]
# Padrão: sem IA. Publica só o texto pronto da fila (social/fila/<data>-<formato>/texto.json); sem
# texto para o dia, não publica nada e sai com código 3 (hora de pedir mais conteúdo ao Claude).
# -ComIA: sem texto na fila, o robô escreve na hora com o Claude (claude -p ou ANTHROPIC_API_KEY).
# Atraso (PC desligado no horário, a tarefa roda ao entrar):
#   - antes do horário de hoje (sobra da tarefa de ontem): não faz nada, o post de hoje sai na hora dele;
#   - mais de 90 min atrasado: só publica entre 8h e 22h; fora disso sai com código 8 e pula o dia.
#   -ForaDaJanela (ou -Force / -Dry) ignora as duas regras.
# Falha (código 1): uma nova tentativa depois de 10 min. Não tenta de novo se o erro foi no
# media_publish (o post pode ter saído: confira o perfil antes de publicar outro).
# Código 7: o dono pediu para refazer o texto no painel (revisao.json): nada publicado.
param(
  [Parameter(Mandatory = $true)][ValidateSet('carrossel', 'reels')][string]$Formato,
  [switch]$Dry,
  [switch]$Force,
  [switch]$ComIA,
  [switch]$ForaDaJanela
)

$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location $repo

# Node 20 do nvm (o Node padrão da máquina pode ser antigo demais para o Next/tsx).
$node = Get-ChildItem (Join-Path $env:APPDATA 'nvm') -Directory -Filter 'v20.*' -ErrorAction SilentlyContinue |
  Sort-Object { [version]($_.Name.TrimStart('v')) } -Descending |
  ForEach-Object { Join-Path $_.FullName 'node.exe' } |
  Where-Object { Test-Path $_ } |
  Select-Object -First 1
if (-not $node) { $node = 'node' }

# ffmpeg e Python (voz grátis) no PATH do usuário; Claude Code só no -ComIA.
$env:Path = "$env:USERPROFILE\.local\bin;$env:LOCALAPPDATA\Microsoft\WinGet\Links;$env:Path"

$logs = Join-Path $repo 'social\logs'
New-Item -ItemType Directory -Force $logs | Out-Null
$log = Join-Path $logs ("{0}-{1}.log" -f (Get-Date -Format 'yyyy-MM-dd_HHmm'), $Formato)

$extra = @()
if ($Dry) { $extra += '--dry' }
if ($Force) { $extra += '--force' }

# stderr do Node vira texto no log (sem parar o script); o código de saída é o do Node.
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8  # Node escreve UTF-8: acentos certos no log

function Anotar([string]$texto) { $texto | Out-File -FilePath $log -Append -Encoding utf8 }

function Run-Robo([string[]]$flags) {
  $argv = @('node_modules\tsx\dist\cli.mjs', 'scripts\social\run.ts', $Formato) + $flags
  Anotar "[$(Get-Date -Format s)] $Formato $($flags -join ' ') com $node"
  & $node @argv 2>&1 | ForEach-Object { "$_" } | Out-File -FilePath $log -Append -Encoding utf8
  return $LASTEXITCODE
}

# Horário de hoje: igual aos gatilhos do agendar.ps1 e a REELS_HOURS/CAROUSEL_HOUR do queue.ts.
$agora = Get-Date
$hora = 12
if ($Formato -eq 'reels') {
  $hora = switch ($agora.DayOfWeek) { 'Friday' { 18 } 'Saturday' { 10 } default { 19 } }
}
$previsto = $agora.Date.AddHours($hora)

if (-not ($Dry -or $Force -or $ForaDaJanela)) {
  if ($agora -lt $previsto.AddMinutes(-10)) {
    Anotar "[$(Get-Date -Format s)] $Formato --fila com $node"
    Anotar "Antes do horário de hoje ($($previsto.ToString('HH:mm'))): nada a fazer, o post de hoje sai na hora dele."
    Anotar "[$(Get-Date -Format s)] saiu com código 0"
    exit 0
  }
  $atraso = ($agora - $previsto).TotalMinutes
  if ($atraso -gt 90 -and ($agora.Hour -lt 8 -or $agora.Hour -ge 22)) {
    Anotar "[$(Get-Date -Format s)] $Formato --fila com $node"
    Anotar "ATRASADO fora da janela 8h-22h (previsto $($previsto.ToString('HH:mm'))): nada publicado hoje. Para publicar mesmo assim: agendado.ps1 -Formato $Formato -ForaDaJanela"
    Anotar "[$(Get-Date -Format s)] saiu com código 8"
    exit 8
  }
}

$code = Run-Robo (@('--fila') + $extra)
if ($code -eq 3) {
  if ($ComIA) {
    $code = Run-Robo $extra
  } else {
    Anotar "Sem texto pronto na fila para hoje: nada publicado. Peça mais conteúdo ao Claude (run.ts plano)."
  }
}

# Uma nova tentativa para falha passageira (rede caída, timeout da Meta). O que já saiu não sai de
# novo (run.ts confere Instagram e YouTube em separado).
if ($code -eq 1 -and -not $Dry) {
  $noFim = Select-String -Path $log -Pattern 'media_publish' -Quiet
  $dentro = $ForaDaJanela -or $Force -or ((Get-Date).AddMinutes(10).Hour -ge 8 -and (Get-Date).AddMinutes(10).Hour -lt 22)
  if ($noFim) {
    Anotar "Falhou na etapa final (media_publish): o post pode ter saído. Sem nova tentativa: confira o perfil."
  } elseif (-not $dentro) {
    Anotar "Falhou e a nova tentativa cairia fora da janela 8h-22h: fica para você decidir."
  } else {
    Anotar "[$(Get-Date -Format s)] saiu com código 1"
    Anotar "Nova tentativa em 10 minutos."
    Start-Sleep -Seconds 600
    $code = Run-Robo (@('--fila') + $extra)
  }
}
Anotar "[$(Get-Date -Format s)] saiu com código $code"
Get-Content $log -Tail 5
exit $code
