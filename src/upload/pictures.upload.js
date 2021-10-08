const multer = require('multer');


//Tải ảnh lên server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/users/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

exports.upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        //console.log(file);
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(Error('Just only "Image" by ".png" or ".jpg".'));
        }
    }
})
