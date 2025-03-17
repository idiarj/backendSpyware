@echo off
powershell -Command "Start-Process cmd -ArgumentList '/c sc start Spyware ' -Verb RunAs"
