
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');

const getData = (req, res) => {
    console.log("=====>", path.join(__dirname, '..', 'views', 'index.html'));
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
}


const uploadData = (req, res ) => {

}


const convert = (req, res, next) => {
    if (req.file) {
        console.log(req.file);

        const inputFilePath = req.file.path;
        const compressedOutput = Date.now() + "compressed.mp4";

        ffmpeg()
            .input(inputFilePath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .audioBitrate('128k')
            .outputOptions(['-preset fast', '-crf 28'])
            .output(compressedOutput)
            .on('end', () => {
                console.log("File is compressed");
                res.download(compressedOutput, (err) => {
                    if (err) throw err;

                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(compressedOutput);
                    fs.rmdirSync('public/uploads');
                    fs.rmdirSync('public');

                    next();
                });
            })
            .on('error', (error) => {
                console.log(`Error: ${error.message}`);
            })
            .run();
    }
};


module.exports = { getData, convert }