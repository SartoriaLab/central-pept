Add-Type -AssemblyName System.Speech
$lines = Get-Content -Encoding UTF8 "$PSScriptRoot\narracao.txt" | Where-Object { $_.Trim() -ne '' }
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('Microsoft Maria Desktop')
$s.Rate = 0
$i = 1
foreach ($l in $lines) {
  $s.SetOutputToWaveFile("$PSScriptRoot\audio\a$i.wav")
  $s.Speak($l)
  $i++
}
$s.SetOutputToNull()
