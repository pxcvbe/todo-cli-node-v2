/**
 * @fileoverview Storage service for reading and writing todo data to JSON files.
 * @module services/storageService
 * @description Handles all file system operations for persisting and retrieving todo data.
 */

import fs from 'fs';
import { DATA_FILE  } from '../config/constants.js';

/**
 * Service class for managing file storage operations.
 * @class StorageService
 * @description Provides methods to read, write, and check file existence for todo data storage.
 */
class StorageService {
    /**
     * Creates a new StorageService instance.
     * @param {string} [dataFile=DATA_FILE] - Path to the JSON file for storing todos.
     * @constructor
     */
    constructor(dataFile = DATA_FILE) {
        /**
         * Path to the data file.
         * @type {string}
         * @private
         */
        this.dataFile = dataFile;
        this.initializeStorage();
    }

    /**
     * Initializes the storage file if it doesn't exist.
     * Creates an empty array in the file if the file is missing.
     * @method initializeStorage
     * @returns {void}
     * @private
     */
    initializeStorage() {
        if (!fs.existsSync(this.dataFile)) {
            this.write([]);
        }
    }

    /**
     * Reads and parses the data from the storage file.
     * @method read
     * @returns {Array<Object>} Array of todo objects.
     * @throws {Error} If the file cannot be read or parsed.
     */
    read() {
        try {
            const data = fs.readFileSync(this.dataFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read data: ${error.message}`);
        }
    }

    /**
     * Writes data to the storage file.
     * @method write
     * @param {Array<Object>} data - Array of todo objects to write.
     * @returns {boolean} True if the write operation was successful.
     * @throws {Error} If the file cannot be written.
     */
    write(data) {
        try {
            fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Failed to write data: ${error.message}`);
        }
    }

    /**
     * Reads and parses data from a specific file path.
     * @method readFile
     * @param {string} filePath - Path to the file to read.
     * @returns {Array<Object>} Parsed JSON data from the file.
     * @throws {Error} If the file cannot be read or parsed.
     */
    readFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }

    /**
     * Writes data to a specific file path.
     * @method writeFile
     * @param {string} filePath - Path to the file to write.
     * @param {Array<Object>} data - Data to write to the file.
     * @returns {boolean} True if the write operation was successful.
     * @throws {Error} If the file cannot be written.
     */
    writeFile(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            throw new Error(`Failed to write file: ${error.message}`);
        }
    }

    /**
     * Checks if a file exists at the specified path.
     * @method fileExists
     * @param {string} filePath - Path to check.
     * @returns {boolean} True if the file exists, false otherwise.
     */
    fileExists(filePath) {
        return fs.existsSync(filePath);
    }
}

/**
 * Default StorageService instance.
 * @type {StorageService}
 * @exports storageService
 */
export default new StorageService();