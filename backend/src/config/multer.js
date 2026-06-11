const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads'),

    // destination: async function(req,file,cb){
    //     try{
    //         cb(null,path.join(__dirname, "../uploads"))

    //     }catch(err){console.log("error in mullter Config -",err)}
    // },
    filename:function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    },
});

const upload = multer({storage})

module.exports = upload;    