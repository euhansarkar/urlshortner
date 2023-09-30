import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as fs from "fs";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: "../config/.env" });

cloudinary.config({
  cloud_name: "df916o3vt",
  api_key: "342159663132698",
  api_secret: "WF1_1MXe0XXvIQegYzDAcKLm49M",
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `uploads`);
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname.split(`.`)[0];
    callback(
      null,
      `${originalName}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      fs.unlinkSync(file.path);
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};
