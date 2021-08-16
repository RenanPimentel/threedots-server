import { Schema, model } from "mongoose";

const userSchema = new Schema({
  avatar: String,
  createdAt: String,
  email: String,
  username: { type: String, maxLength: 32 },
  password: String,
  followers: [{ follower: { type: Schema.Types.ObjectId, ref: "User" } }],
  following: [{ following: { type: Schema.Types.ObjectId, ref: "User" } }],
  notifications: [
    {
      author: { type: Schema.Types.ObjectId, ref: "User" },
      body: String,
      createdAt: String,
    },
  ],
});

export default model("User", userSchema);
