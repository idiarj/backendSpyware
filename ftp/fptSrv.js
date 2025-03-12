import FtpServer from "ftp-srv";
import { COLORS } from "../utils/colors.js";
import { FsWrapper } from "../utils/fsWrapper.js";
import path from 'path';

class ServidorFTP {
    constructor(url, psvRange = [6000, 7000], anonymous = true, rootDir = './server/public') {
        this.server = null;
        this.url = url;
        this.psvRange = psvRange;
        this.anonymous = anonymous;
        this.rootDir = rootDir;
    }

    async start() {
        try {
            this.server = new FtpServer({
                url: this.url,
                pasv_range: this.psvRange,
                anonymous: this.anonymous,
                pasv_url: `ftp://192.168.0.103`
            });

            this.server.on(`login`, (data, resolve, reject) => {
                const { username } = data;
                console.log(`${COLORS.reset}Login event triggered`);
                console.log(`Username:`, username);
                console.log(`Anonymous allowed:`, this.anonymous);
                if (username === `anonymous` && this.anonymous) {
                    resolve({ root: this.rootDir });
                } else {
                    reject(`Unauthorized`);
                }
            });

            this.server.on('STOR', async (error, fileName, fileStream) => {
                if (error) {
                    console.error(`Error receiving file:`, error);
                    return;
                }
                const filePath = path.join('./stolenFiles', fileName);
                const writeStream = FsWrapper.writeFile(filePath, fileStream);
                fileStream.pipe(writeStream);
                console.log(`${COLORS.text.green}File received: ${fileName}`);
            });

            await this.server.listen();
            console.log(`${COLORS.text.blue}Server running at ${this.url}`);
        } catch (error) {
            console.error(`Error starting FTP server:`, error);
            throw error;
        }
    }

    async stop() {
        try {
            const isRunning = this.isServerRunning();
            console.log(`isRunning:`, isRunning);
            if(!isRunning){
                console.log(`a`);
                return {success: false, error: `El servidor no está corriendo`};
            }
            console.log(`${COLORS.text.red}Stopping server at ${this.url}`);
            await this.server.close();
            this.server = null;
            console.log(`${COLORS.reset}Server stopped`);
            return {success: true, mensaje: `Servidor detenido`};
        } catch (error) {
            console.error(`Error stopping FTP server:`, error);
            throw error;
        }
    }

    isServerRunning() {
        return !!this.server;
    }
}

export const ftp = new ServidorFTP(`ftp://192.168.0.142:21`);