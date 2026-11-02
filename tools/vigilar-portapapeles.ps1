# Saves every image that lands in the clipboard to fotos\cap-NN.png (in order), then clears the clipboard.
# Stops after $Max images or $Seconds seconds.
param([int]$Max = 20, [int]$Seconds = 900)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$out = "C:\Users\carlos\Desktop\truly-cali\fotos"
$n = 0
$end = (Get-Date).AddSeconds($Seconds)
[System.Windows.Forms.Clipboard]::Clear()
while ($n -lt $Max -and (Get-Date) -lt $end) {
  try {
    if ([System.Windows.Forms.Clipboard]::ContainsImage()) {
      $img = [System.Windows.Forms.Clipboard]::GetImage()
      $n++
      $file = Join-Path $out ("cap-{0:D2}.png" -f $n)
      $img.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output ("guardada {0} {1}x{2}" -f $file, $img.Width, $img.Height)
      $img.Dispose()
      [System.Windows.Forms.Clipboard]::Clear()
    }
  } catch { }
  Start-Sleep -Milliseconds 400
}
Write-Output "fin: $n imagenes"
