import { Schema, model } from "mongoose";

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  body: String,
  createdAt: String,
  comments: [
    {
      author: { type: Schema.Types.ObjectId, ref: "User" },
      body: String,
      createdAt: String,
    },
  ],
  likes: [{ author: { type: Schema.Types.ObjectId, ref: "User" } }],
});

export default model("Post", postSchema);
