import mongoose from "mongoose";


const pageUrlSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bodyUrls: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

export const PageUrl = mongoose.model(`PageUrl`, pageUrlSchema);
