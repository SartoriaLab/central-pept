# Cria (ou recria) as tarefas do Agendador do Windows que publicam no @dosecerta_br:
#   carrossel todo dia às 12h; Reels às 19h30 de domingo, segunda, quarta e sexta.
# Só rodam com o usuário logado; se o computador estava desligado no horário, rodam ao entrar.
# Uso: npm run social:agendar        (remover: npm run social:agendar -- -Remover)
param([switch]$Remover)

$pasta = '\DoseCerta\'
$tarefas = @(
  @{ Nome = 'Carrossel'; Formato = 'carrossel'; Gatilho = { New-ScheduledTaskTrigger -Daily -At '12:00' } },
  @{ Nome = 'Reels'; Formato = 'reels'; Gatilho = { New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday, Monday, Wednesday, Friday -At '19:30' } }
)

if ($Remover) {
  foreach ($t in $tarefas) { Unregister-ScheduledTask -TaskPath $pasta -TaskName $t.Nome -Confirm:$false -ErrorAction SilentlyContinue }
  Write-Output 'Tarefas do DoseCerta removidas.'
  exit 0
}

$script = Join-Path $PSScriptRoot 'agendado.ps1'
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 40) -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive

foreach ($t in $tarefas) {
  $acao = New-ScheduledTaskAction -Execute 'powershell.exe' -WorkingDirectory (Split-Path $PSScriptRoot -Parent | Split-Path -Parent) `
    -Argument ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}" -Formato {1}' -f $script, $t.Formato)
  Register-ScheduledTask -TaskPath $pasta -TaskName $t.Nome -Action $acao -Trigger (& $t.Gatilho) -Settings $settings `
    -Principal $principal -Description "Publica $($t.Formato) no @dosecerta_br (scripts/social)." -Force | Out-Null
  $info = Get-ScheduledTaskInfo -TaskPath $pasta -TaskName $t.Nome
  Write-Output ("{0}: próxima execução {1}" -f $t.Nome, $info.NextRunTime)
}
