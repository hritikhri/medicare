const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.uploadFile = async (req, res, next) => {
  upload.single('profilePic')(req, res, async (err) => {
    if (err) return next(err);
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(req.file.buffer);
      });
      console.log("URL genrated")
      req.profilePicUrl= result.secure_url;
      next();
      // res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      console.log(err)
      next(err);
    }
  });
};