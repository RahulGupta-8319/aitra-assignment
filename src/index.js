const express = require('express')
const fs = require('fs')
const mongoose = require("mongoose");

const path = require('path')
const multer = require('multer')
const bodyParser = require('body-parser')
const app = express()
const videoController = require('./controllers/videoController')


const dir = 'public';
const subDirectory = 'public/uploads'

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.mkdirSync(subDirectory)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const PORT = process.env.PORT || 3000

mongoose.connect("mongodb+srv://newuser:newuser@cluster0.ghayzlv.mongodb.net/aitra", {
    useNewUrlParser: true
})
    .then(() => console.log("mongoDb is connected"))
    .catch(err => console.log(err))

app.get('/',
    videoController.getData
)

app.post('/upload', upload.single('file'),
    videoController.uploadData
)

app.get('/download/:filename',
    videoController.download
);

app.use("*", (req, res) => {
    res.status(400).send('404-URL NOT FOUND ....!!')
})

app.listen(PORT, () => {
    console.log(`App is listening on Port ${PORT}`)
})