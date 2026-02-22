Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Obter o diretório do script
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
backendPath = scriptDir & "\backend"
batFile = scriptDir & "\start-backend.bat"

' Verificar se o backend já está rodando
On Error Resume Next
Set http = CreateObject("MSXML2.XMLHTTP")
http.Open "GET", "http://localhost:3000/api/health", False
http.setTimeouts 1000, 1000, 1000, 1000
http.Send

If http.Status = 200 Then
    ' Backend já está rodando
    WScript.Quit
End If

' Iniciar backend em janela minimizada
WshShell.Run """" & batFile & """", 2, False










