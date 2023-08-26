const express = require('express');
const router = express.Router();
const controller = require('../controllers/videoController');
const multer = require('multer')
const path = require('path')

var dir = 'public';
var subDirectory = 'public/uploads';

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.mkdirSync(subDirectory);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.get('/', controller.getIndex);
router.post('/convert', upload.single('file'), controller.convertVideo);

module.exports = router;
