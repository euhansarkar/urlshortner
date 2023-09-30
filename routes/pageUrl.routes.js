import express from "express";
import { PageUrl } from "../models/PageUrl.model.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });
import Url from "../models/Url.js";
import { FileUploadHelper } from "../helper/fileUploadHelper.js";
const router = express.Router();

router.post(
  `/page-url`,
  FileUploadHelper.upload.single("file"),
  async (req, res) => {
    const data = JSON.parse(JSON.parse(JSON.stringify(req.body.data)));
    const file = req.file;
    let uploadedImage = await FileUploadHelper.uploadToCloudinary(file);

    if (uploadedImage?.secure_url) {
      data.imageUrl = uploadedImage?.secure_url;
    }

    const pageUrl = await PageUrl.create(data);

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
  }
);

export const PageUrlRouter = router;
