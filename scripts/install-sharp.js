const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const sharpPath = path.join(__dirname, '..', 'node_modules', 'sharp');

try {
    console.log("checking sharp")
    const sharp = require('sharp');
    console.log("sharp is installed")
} catch (error) {
    try {
        console.log("error attempting to install sharp!")
        exec('echo $PATH; yarn add sharp --ignore-engines', (error, stdout, stderr) => {
            console.log("oops, not good")
            if (error) {
                console.error(`Error installing sharp: ${error}`);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }

            console.log(`stdout: ${stdout}`);
        });

    }
    catch (error) {
        console.error(`Error installing sharp: ${error}`);
    }
    const sharp = require('sharp');
    console.log("sharp is installed!")
}

