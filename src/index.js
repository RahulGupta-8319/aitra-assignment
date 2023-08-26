const express = require('express')
const fs = require('fs')

const path = require('path')
const multer = require('multer')
const bodyParser = require('body-parser')
const app = express()
const videoController = require('./controllers/videoController')


var dir = 'public';
var subDirectory = 'public/uploads'

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);

    fs.mkdirSync(subDirectory)

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

const PORT = process.env.PORT || 3000



app.get('/',
    (req, res) => {
      res.send('wohoo...!!')
    }
)
app.post('/upload',
    videoController.getData
)

app.post('/convert', upload.single('file'),
    videoController.convert
);


app.listen(PORT, () => {
    console.log(`App is listening on Port ${PORT}`)
})