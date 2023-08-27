const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg');
const { uploadFile } = require('./awsController');
const urlModel = require('../models/model.js')

const getData = (req, res) => {
    console.log("=====>", path.join(__dirname, '..', 'views', 'index.html'));
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
}

// ============= upload video 
const uploadData = async (req, res) => {

    if (req.file) {

        console.log("req.file===>", req.file);

        let extension = path.extname(req.file.originalname)

        if(extension !== '.mp4'){
            return res.status(400).send({ status: false, message: "Upload Video file Only.!!" })
        }

        const inputFilePath = req.file.path;
        const compressedOutput = req.file.filename.replace('.mp4', "") + "-compressed.mp4";


        const compressedFile = await ffmpeg()
            .input(inputFilePath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .audioBitrate('128k')
            .outputOptions(['-preset fast', '-crf 28'])
            .output(compressedOutput)
            .on('end',
                async () => {
                    console.log("File is compressed", compressedOutput);
                    const bufferData = await fs.readFileSync(compressedOutput)

                    let file = {}
                    file.buffer = bufferData
                    file.originalname = compressedOutput

                    // console.log(file);

                    let uploadUrl = await uploadFile(file)
                    // console.log(uploadUrl);

                    let objectForDb = {
                        fileName: req.file.originalname,
                        url: uploadUrl
                    }

                    // console.log("objectForDb", objectForDb);

                    let savedData = await urlModel.create(objectForDb)//.select({_id:0})

                    console.log(savedData);

                    fs.unlinkSync(inputFilePath);
                    fs.unlinkSync(compressedOutput);

                    return res.status(201).send({ status: true, message: "Video upload successfully" })
                }
            )
            .on('error', (error) => {
                console.log(`Error: ${error.message}`);
            })
            .run();

    }

}

// ============== download video 

const download = async (req, res) => {

    let filenameByUser = req.params.filename
    console.log(filenameByUser);

    if (filenameByUser) {
        let urlFound = await urlModel.findOne({ fileName: filenameByUser })

        if (!urlFound) {
            console.log('data not found');
            res.status(404).send(`data not found with the given ${filenameByUser}..!!`)
        }

        // console.log(urlFound.url)
        res.redirect(urlFound.url)

    }
};


module.exports = { getData, download, uploadData }