import fs from 'fs';
import { DATA_FILE  } from '../config/constants.js';

class StorageService {
    constructor(dataFile = DATA_FILE) {
        this.dataFile = dataFile;
        this.initializeStorage();
    }

    initializeStorage() {
        if (!fs.existsSync(this.dataFile)) {
            this.write([]);
        }
    }

    read() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read data: ${error.message}`);
        }
    }

    write(data) {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Failed to write data: ${error.message}`);
        }
    }

    readFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }

    writeFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Failed to write file: ${error.message}`);
        }
    }

    fileExists(filePath) {
        return fs.existsSync(filePath);
    }
}

export default new StorageService();