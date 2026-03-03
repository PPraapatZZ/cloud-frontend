$dir = "c:\Users\pea64\Desktop\Demo"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()
Write-Host "Server started on http://localhost:8000/"

while($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response
  
  $path = $request.Url.LocalPath
  if ($path -eq "/") { $path = "/index.html" }
  
  $file = Join-Path $dir $path.TrimStart('/')
  
  if (Test-Path $file) {
    $content = [System.IO.File]::ReadAllBytes($file)
    if ($file -match '\.jsx?$') { $response.ContentType = "text/javascript; charset=utf-8" }
    elseif ($file -match '\.html$') { $response.ContentType = "text/html; charset=utf-8" }
    else { $response.ContentType = "application/octet-stream" }
    
    $response.OutputStream.Write($content, 0, $content.Length)
  } else {
    $response.StatusCode = 404
  }
  
  $response.Close()
}
