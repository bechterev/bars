const multer = require('multer');
 
var storage = multer.memoryStorage()
var Mupload = multer({storage: storage});
 
module.exports = Mupload;