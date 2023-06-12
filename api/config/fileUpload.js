import multer from "multer";
import path from 'path'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, 'photo' + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const error = new Error("Only .png, .jpg and .jpeg format allowed!");
      error.name = "ExtensionError";
      return cb(error);
    }
  },
});
