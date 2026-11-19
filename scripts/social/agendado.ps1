# Roda o robô do Instagram neste computador e guarda o log em social/logs/.
# Chamado pelas tarefas do Agendador (agendar.ps1) ou à mão:
#   powershell -ExecutionPolicy Bypass -File scripts\social\agendado.ps1 -Formato carrossel [-Dry] [-Force] [-ComIA]
# Padrão: sem IA. Publica só o texto pronto da fila (social/fila/<data>-<formato>/texto.json); sem
# texto para o dia, não publica nada e sai com código 3 (hora de pedir mais conteúdo ao Claude).
# -ComIA: sem texto na fila, o robô escreve na hora com o Claude (claude -p ou ANTHROPIC_API_KEY).
param(
  [Parameter(Mandatory = $true)][ValidateSet('carrossel', 'reels')][string]$Formato,
  [switch]$Dry,
  [switch]$Force,
  [switch]$ComIA
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

function Run-Robo([string[]]$flags) {
  $argv = @('node_modules\tsx\dist\cli.mjs', 'scripts\social\run.ts', $Formato) + $flags
  "[$(Get-Date -Format s)] $Formato $($flags -join ' ') com $node" | Out-File -FilePath $log -Append -Encoding utf8
  & $node @argv 2>&1 | ForEach-Object { "$_" } | Out-File -FilePath $log -Append -Encoding utf8
  return $LASTEXITCODE
}

$code = Run-Robo (@('--fila') + $extra)
if ($code -eq 3) {
  if ($ComIA) {
    $code = Run-Robo $extra
  } else {
    "Sem texto pronto na fila para hoje: nada publicado. Peça mais conteúdo ao Claude (run.ts plano)." |
      Out-File -FilePath $log -Append -Encoding utf8
  }
}
"[$(Get-Date -Format s)] saiu com código $code" | Out-File -FilePath $log -Append -Encoding utf8
Get-Content $log -Tail 5
exit $code
