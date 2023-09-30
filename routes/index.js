import express from "express";
import Url from "../models/Url.js";
import { PageUrl } from "../models/PageUrl.model.js";

const router = express.Router();

router.get("/page-url/:id", async (req, res) => {
  try {
    const data = await PageUrl.findOne({ _id: req.params.id });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

router.get("/:urlId", async (req, res) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    if (url) {
      await Url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

export default router;
