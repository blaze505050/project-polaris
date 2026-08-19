Add-Type -AssemblyName System.Drawing

git checkout src/assets/*.jpg

function Compress-Jpeg($src, $dst, $w, $h, $qual) {
    $srcImg = [System.Drawing.Image]::FromFile($src)
    $ratio = [Math]::Min($w / $srcImg.Width, $h / $srcImg.Height)
    if ($ratio -gt 1.0) { $ratio = 1.0 }
    $targetW = [int]($srcImg.Width * $ratio)
    $targetH = [int]($srcImg.Height * $ratio)

    $targetBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $graphics.DrawImage($srcImg, 0, 0, $targetW, $targetH)
    $graphics.Dispose()
    $srcImg.Dispose()

    $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
    $jpegCodec = $null
    foreach ($c in $codecs) {
        if ($c.MimeType -eq "image/jpeg") {
            $jpegCodec = $c
            break
        }
    }

    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$qual)

    $targetBmp.Save($dst, $jpegCodec, $encoderParams)
    $encoderParams.Dispose()
    $targetBmp.Dispose()
}

function Compress-Png($src, $dst, $maxDim) {
    $srcImg = [System.Drawing.Image]::FromFile($src)
    $ratio = [Math]::Min($maxDim / $srcImg.Width, $maxDim / $srcImg.Height)
    if ($ratio -gt 1.0) { $ratio = 1.0 }
    $targetW = [int]($srcImg.Width * $ratio)
    $targetH = [int]($srcImg.Height * $ratio)

    $targetBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImg, 0, 0, $targetW, $targetH)
    $graphics.Dispose()
    $srcImg.Dispose()

    $targetBmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $targetBmp.Dispose()
}

$ws = (Get-Location).Path

Compress-Png "$ws\src\assets\polaris-logo.png" "$ws\src\assets\polaris-logo-opt.png" 160
Compress-Png "$ws\public\polaris-logo.png" "$ws\public\polaris-logo-opt.png" 160
Compress-Jpeg "$ws\src\assets\students-building.jpg" "$ws\src\assets\students-building-opt.jpg" 800 600 78
Compress-Jpeg "$ws\src\assets\night-observation.jpg" "$ws\src\assets\night-observation-opt.jpg" 800 600 78

Move-Item -Force "$ws\src\assets\polaris-logo-opt.png" "$ws\src\assets\polaris-logo.png"
Move-Item -Force "$ws\public\polaris-logo-opt.png" "$ws\public\polaris-logo.png"
Move-Item -Force "$ws\src\assets\students-building-opt.jpg" "$ws\src\assets\students-building.jpg"
Move-Item -Force "$ws\src\assets\night-observation-opt.jpg" "$ws\src\assets\night-observation.jpg"

Get-Item "$ws\src\assets\*" | Select-Object Name, Length
