Add-Type -AssemblyName System.Drawing

$repo = Split-Path -Parent $PSScriptRoot
$sourceRoot = 'C:\Users\OMEN\.codex\generated_images\01a1b299-8f0e-79e2-b1a2-684ea548d16a'
$outputRoot = Join-Path $repo 'public\ig-templates\highlights'
$desktopRoot = 'C:\Users\OMEN\Desktop\OKLA.CZ\IG\Highlights'
$iconRoot = Join-Path $outputRoot 'icons'

New-Item -ItemType Directory -Force -Path $outputRoot, $desktopRoot, $iconRoot | Out-Null

$items = @(
    @{ Name='01-novinky'; File='exec-9b7db423-e72d-467a-96b8-2a606b2a86df.png' },
    @{ Name='02-slevy'; File='exec-03a608e9-56bf-4559-9f1b-5622c24bab78.png' },
    @{ Name='03-souteze'; File='exec-3be2b1d9-1cea-4c39-802a-416aabcbfbb2.png' },
    @{ Name='04-produkty'; File='exec-4acd2720-c5a0-4782-950e-189274a260cf.png' },
    @{ Name='05-navody'; File='exec-e532605c-b505-4cd3-803a-8b482b389858.png' },
    @{ Name='06-tipy'; File='exec-46bc90a2-d04a-4e32-9f0f-0e65a3648833.png' },
    @{ Name='07-recenze'; File='exec-6341d3cf-9074-48aa-af64-76cd79826895.png' },
    @{ Name='08-doprava'; File='exec-22020afc-bf3a-476d-aa11-63259ddba978.png' },
    @{ Name='09-podpora'; File='exec-148633ad-1227-4310-9e66-c1fb7e135d7f.png' },
    @{ Name='10-o-nas'; File='exec-4b526445-5576-411b-813c-85d254e12e8a.png' }
)

function Get-AlphaBounds([System.Drawing.Bitmap]$bitmap, [int]$threshold) {
    $minX = $bitmap.Width
    $minY = $bitmap.Height
    $maxX = -1
    $maxY = -1
    for ($y = 0; $y -lt $bitmap.Height; $y += 2) {
        for ($x = 0; $x -lt $bitmap.Width; $x += 2) {
            if ($bitmap.GetPixel($x, $y).A -ge $threshold) {
                if ($x -lt $minX) { $minX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    if ($maxX -lt 0) { throw 'No opaque icon pixels found.' }
    [System.Drawing.Rectangle]::FromLTRB($minX, $minY, $maxX + 2, $maxY + 2)
}

function New-CrispIcon([string]$sourcePath, [string]$destinationPath) {
    $source = [System.Drawing.Bitmap]::FromFile($sourcePath)
    try {
        $bounds = Get-AlphaBounds $source 185
        $result = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        for ($y = 0; $y -lt $bounds.Height; $y++) {
            for ($x = 0; $x -lt $bounds.Width; $x++) {
                $pixel = $source.GetPixel($bounds.X + $x, $bounds.Y + $y)
                $alpha = if ($pixel.A -ge 215) { 255 } elseif ($pixel.A -le 165) { 0 } else { [int](($pixel.A - 165) * 5.1) }
                $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
            }
        }
        $result.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $result.Dispose()
    }
    finally {
        $source.Dispose()
    }
}

function New-GradientCover([string]$iconPath, [string]$destinationPath) {
    $canvas = New-Object System.Drawing.Bitmap(500, 500, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    try {
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $rect = New-Object System.Drawing.Rectangle(0, 0, 500, 500)
        $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.ColorTranslator]::FromHtml('#063DA8'), [System.Drawing.ColorTranslator]::FromHtml('#00A8B8'), 145.0)
        $blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
        $blend.Positions = [single[]](0.0, 0.52, 1.0)
        $blend.Colors = [System.Drawing.Color[]]@(
            [System.Drawing.ColorTranslator]::FromHtml('#063DA8'),
            [System.Drawing.ColorTranslator]::FromHtml('#075FE6'),
            [System.Drawing.ColorTranslator]::FromHtml('#00A8B8')
        )
        $brush.InterpolationColors = $blend
        $graphics.FillRectangle($brush, $rect)
        $brush.Dispose()

        $icon = [System.Drawing.Bitmap]::FromFile($iconPath)
        try {
            $maxSize = 188.0
            $scale = [Math]::Min($maxSize / $icon.Width, $maxSize / $icon.Height)
            $targetWidth = [int][Math]::Round($icon.Width * $scale)
            $targetHeight = [int][Math]::Round($icon.Height * $scale)
            $targetX = [int][Math]::Round((500 - $targetWidth) / 2)
            $targetY = [int][Math]::Round((500 - $targetHeight) / 2)
            $graphics.DrawImage($icon, $targetX, $targetY, $targetWidth, $targetHeight)
        }
        finally {
            $icon.Dispose()
        }
        $canvas.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $graphics.Dispose()
        $canvas.Dispose()
    }
}

foreach ($item in $items) {
    $sourcePath = Join-Path $sourceRoot $item.File
    $iconPath = Join-Path $iconRoot ($item.Name + '-icon.png')
    $coverPath = Join-Path $outputRoot ($item.Name + '.png')
    New-CrispIcon $sourcePath $iconPath
    New-GradientCover $iconPath $coverPath
    Copy-Item -LiteralPath $coverPath -Destination (Join-Path $desktopRoot ($item.Name + '.png')) -Force
}

$preview = New-Object System.Drawing.Bitmap(2500, 1000, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$previewGraphics = [System.Drawing.Graphics]::FromImage($preview)
try {
    $previewGraphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#EAF0F7'))
    for ($i = 0; $i -lt $items.Count; $i++) {
        $cover = [System.Drawing.Bitmap]::FromFile((Join-Path $outputRoot ($items[$i].Name + '.png')))
        try {
            $x = ($i % 5) * 500
            $y = [Math]::Floor($i / 5) * 500
            $previewGraphics.DrawImage($cover, $x, $y, 500, 500)
        }
        finally {
            $cover.Dispose()
        }
    }
    $previewPath = Join-Path $outputRoot '00-preview.png'
    $preview.Save($previewPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Copy-Item -LiteralPath $previewPath -Destination (Join-Path $desktopRoot '00-preview.png') -Force
}
finally {
    $previewGraphics.Dispose()
    $preview.Dispose()
}

Write-Output "Created $($items.Count) highlight covers in $desktopRoot"
