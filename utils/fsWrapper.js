import { promises as fs } from 'fs';
import path from 'path';

export class FsWrapper {
    static async readFile(filePath, encoding = 'utf8') {
        try {
            const data = await fs.readFile(filePath, encoding);
            console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async writeFile(filePath, data, encoding = 'utf8') {
        try {
            console.log('la data que escribiré es', data);
            console.log('el path para escribir el archivo es', filePath);

            const dir = path.dirname(filePath);
            console.log(dir)
            const mkdir = await fs.mkdir(dir, { recursive: true });
            console.log(mkdir);
            await fs.writeFile(filePath, data, encoding);
        } catch (error) {
            throw error;
        }
    }

    static async appendFile(filePath, data, encoding = 'utf8') {
        try {
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });

            await fs.appendFile(filePath, data, encoding);
        } catch (error) {
            throw error;
        }
    }

    static async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw error;
        }
    }

    static async readDirectory(dirPath) {
        try {
            const files = await fs.readdir(dirPath);
            const fileDetails = await Promise.all(files.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const isDirectory = await FsWrapper.isDirectory(filePath);
                return {
                    name: file,
                    path: filePath,
                    isDirectory: isDirectory
                };
            }));
            return fileDetails;
        } catch (error) {
            throw error;
        }
    }

    static async isDirectory(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.isDirectory();
        } catch (error) {
            throw error;
        }
    }

    static async isFile(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.isFile();
        } catch (error) {
            throw error;
        }
    }
}