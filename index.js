/**
 * @fileoverview Entry point for the Todo CLI application.
 * @module index
 * @author Todo CLI Team
 * @version 2.0.0
 * @description Simple and powerful CLI Todo List manager application.
 */
import { createCLI } from "./src/cli.js";

/**
 * Creates and initializes the CLI program, then parses command-line arguments.
 * @returns {void}
 */
const program = createCLI();

program.parse(process.argv);