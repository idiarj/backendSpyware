// import express from 'express';
// import { ftp } from '../ftp/fptSrv.js';
import { ftp } from '../ftp/fptSrv.js';

ftp.start().then(() => {
    console.log('FTP server started successfully');
}).catch((error) => {
    console.error('Failed to start FTP server:', error);
});



