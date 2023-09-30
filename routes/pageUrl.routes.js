import express from "express";
import { PageUrl } from "../models/PageUrl.model.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import Url from "../models/Url.js";
import { FileUploadHelper } from "../helper/fileUploadHelper.js";
dotenv.config({ path: "../config/.env" });
import multer from "multer";
import path from "path";
const router = express.Router();

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

router.post(`/page-url`, upload.single("file"), async (req, res) => {
  const file = req.file;

  let uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

  console.log(uploadedImage);

  const pageUrl = await PageUrl.create(
    JSON.parse(JSON.parse(JSON.stringify(req.body.data)))
  );

  // const findPageUrl = await PageUrl.findById(pageUrl._id);
  // console.log(`page url by id found`, findPageUrl);

  // res.status(200).json(pageUrl);

  const originalUrl = `/page-url/${pageUrl?._id}`;
  const base = process.env.BASE;
  const urlId = nanoid(6);
  if (originalUrl) {
    try {
      let url = await Url.findOne({ originalUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          originalUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

export const PageUrlRouter = router;
