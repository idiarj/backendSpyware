@echo off
powershell -Command "Start-Process cmd -ArgumentList '/c sc query SpywareServ ' -Verb runAs"
