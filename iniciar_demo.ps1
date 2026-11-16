<#
.SYNOPSIS
  Sobe a demonstração completa do FOMEZERO num clique: serviço da AIPA, app da VCIA e o portal (frontend).

.DESCRIPTION
  Abre uma janela do PowerShell para cada serviço (os logs ficam visíveis; feche a janela para parar)
  e abre o navegador no portal. Serviço que já estiver no ar é reaproveitado.
  O assistente da GENAI roda no Colab (GPU): cole o link gradio.live na tela do assistente, ou use o modo simulado.
  Dados e portal parceiro SIMULADOS.

.EXAMPLE
  .\iniciar_demo.ps1
  .\iniciar_demo.ps1 -PastaAipa "D:\repos\GS_2TIAPR_2026_FOMEZERO_AIPA" -PastaVcia "D:\repos\GS_2TIAPR_2026_FOMEZERO_VISAO_COMPUTACIONAL"
  .\iniciar_demo.ps1 -SemVcia
#>
param(
    [string]$PastaAipa = (Join-Path (Split-Path $PSScriptRoot -Parent) "GS_2TIAPR_2026_FOMEZERO_AIPA"),
    [string]$PastaVcia = (Join-Path (Split-Path $PSScriptRoot -Parent) "GS_2TIAPR_2026_FOMEZERO_VISAO_COMPUTACIONAL"),
    [string]$PythonAipa = "",
    [string]$PythonVcia = "",
    [switch]$SemVcia,
    [switch]$SemAipa,
    [switch]$SemNavegador
)

$ErrorActionPreference = "Stop"
$PastaFront = Join-Path $PSScriptRoot "frontend"

function Testar-Porta([int]$Porta) {
    try {
        $cliente = New-Object System.Net.Sockets.TcpClient
        $tentativa = $cliente.BeginConnect("127.0.0.1", $Porta, $null, $null)
        $ok = $tentativa.AsyncWaitHandle.WaitOne(500) -and $cliente.Connected
        $cliente.Close()
        return $ok
    } catch {
        return $false
    }
}

function Escolher-Python([string]$Informado, [string]$Pasta) {
    if ($Informado) { return $Informado }
    $doProjeto = Join-Path $Pasta ".venv\Scripts\python.exe"
    if (Test-Path $doProjeto) { return $doProjeto }
    return "python"
}

function Abrir-Janela([string]$Titulo, [string]$Pasta, [string]$Comando) {
    $script = "`$Host.UI.RawUI.WindowTitle = '$Titulo'; Set-Location -LiteralPath '$Pasta'; $Comando"
    Start-Process powershell -ArgumentList @("-NoExit", "-NoProfile", "-Command", $script) | Out-Null
}

function Esperar-Porta([int]$Porta, [int]$Segundos, [string]$Nome) {
    $limite = (Get-Date).AddSeconds($Segundos)
    while ((Get-Date) -lt $limite) {
        if (Testar-Porta $Porta) {
            Write-Host "  $Nome no ar (porta $Porta)." -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 1
    }
    Write-Host "  $Nome ainda não respondeu na porta $Porta. Veja a janela dele." -ForegroundColor Yellow
    return $false
}

Write-Host "FOMEZERO: demonstração local (dados SIMULADOS)" -ForegroundColor Cyan

# 1. AIPA (robô pós-entrega) em http://127.0.0.1:5070
if (-not $SemAipa) {
    if (Testar-Porta 5070) {
        Write-Host "AIPA: já está no ar (porta 5070)."
    } elseif (-not (Test-Path (Join-Path $PastaAipa "servico_aipa.py"))) {
        Write-Host "AIPA: não achei servico_aipa.py em '$PastaAipa'. Use -PastaAipa." -ForegroundColor Yellow
    } else {
        $env_ = Join-Path $PastaAipa ".env"
        if (-not (Test-Path $env_)) {
            Copy-Item (Join-Path $PastaAipa ".env.exemplo") $env_
            Write-Host "AIPA: .env criado a partir do .env.exemplo (valores de demonstração)."
        }
        $py = Escolher-Python $PythonAipa $PastaAipa
        Write-Host "AIPA: subindo o serviço..."
        Abrir-Janela "FOMEZERO - AIPA (5070)" $PastaAipa "& '$py' servico_aipa.py"
    }
}

# 2. VCIA (triagem por foto) em http://127.0.0.1:7860
if (-not $SemVcia) {
    if (Testar-Porta 7860) {
        Write-Host "VCIA: já está no ar (porta 7860)."
    } elseif (-not (Test-Path (Join-Path $PastaVcia "app\app.py"))) {
        Write-Host "VCIA: não achei app\app.py em '$PastaVcia'. Use -PastaVcia (ou -SemVcia)." -ForegroundColor Yellow
    } else {
        $py = Escolher-Python $PythonVcia $PastaVcia
        Write-Host "VCIA: subindo o app (o modelo leva alguns segundos para carregar)..."
        Abrir-Janela "FOMEZERO - VCIA (7860)" $PastaVcia "`$env:PYTHONIOENCODING='utf-8'; & '$py' app\app.py"
    }
}

# 3. Portal (frontend) em http://localhost:5173
if (Testar-Porta 5173) {
    Write-Host "Portal: já está no ar (porta 5173)."
} else {
    if (-not (Test-Path (Join-Path $PastaFront "node_modules"))) {
        Write-Host "Portal: instalando dependências (npm install, só na primeira vez)..."
        Push-Location $PastaFront
        npm install
        Pop-Location
    }
    Write-Host "Portal: subindo o frontend..."
    Abrir-Janela "FOMEZERO - Portal (5173)" $PastaFront "npm run dev -- --port 5173 --strictPort"
}

Write-Host ""
$portal = Esperar-Porta 5173 60 "Portal"
if (-not $SemAipa) { [void](Esperar-Porta 5070 60 "AIPA") }
if (-not $SemVcia) { [void](Esperar-Porta 7860 120 "VCIA") }

if ($portal -and -not $SemNavegador) {
    Start-Process "http://localhost:5173"
}

Write-Host ""
Write-Host "Pronto. O cabeçalho do portal mostra quais módulos estão no ar." -ForegroundColor Cyan
Write-Host "Para parar, feche as janelas abertas (AIPA, VCIA e Portal)."
