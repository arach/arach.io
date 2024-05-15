const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const sharpPath = path.join(__dirname, '..', 'node_modules', 'sharp');

try {
    console.log("checking sharp")
    const sharp = require('sharp');
    console.log("sharp is installed")
} catch (error) {
    console.log("installing sharp")
    exec('yarn add sharp --ignore-engines', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error installing sharp: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
    });
}

