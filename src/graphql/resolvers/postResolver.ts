import { UserInputError } from "apollo-server";
import Post from "../../models/Post";
import User from "../../models/User";
import { decodeToken } from "../../util/decodeToken";
import { getToken } from "../../util/getToken";
import { handleExpiredToken } from "../../util/handleExpiredToken";
import { validateUserToken } from "../../util/validateUserToken";

const POST_MAX_LENGTH = 255;

const postMutation = {
  async createPost(_: Obj, { body }: Obj, context: Obj) {
    const token = getToken(context);
    body = body.trim();
    const { id, username, password } = decodeToken(token);

    if (body === "") {
      throw new UserInputError("Must provide body", {
        errors: { body: "Must provide body" },
      });
    } else if (body.length > POST_MAX_LENGTH) {
      throw new UserInputError("Post must be within 255 characters", {
        errors: { body: "Post must be within 255 characters" },
      });
    }

    const author = await User.findById(id);

    if (author?.username !== username || author?.password !== password) {
      throw new UserInputError("Author not found", {
        errors: { general: "Author not found or wrong credentials" },
      });
    }

    const post = await Post.create({
      author,
      body,
      createdAt: new Date().toISOString(),
    });

    return { ...post._doc, author, id: post.id, liked: false, likeCount: 0 };
  },

  async deletePost(_: Obj, { postId }: Obj, context: Obj) {
    const token = getToken(context);
    const { id, username, password } = decodeToken(token);

    const { author } = await Post.findById(postId).populate("author");

    if (
      author?.password !== password ||
      author.username !== username ||
      String(author._id) !== id
    ) {
      throw new UserInputError("Not allowed");
    }

    await Post.findByIdAndDelete(postId);
    return "deleted";
  },

  async updatePost(_: Obj, { token, postId, body }: Obj) {
    const { id, username, password, exp } = decodeToken(token);
    handleExpiredToken({ exp });

    const post = await Post.findById(postId).populate("author");

    if (
      post.author?.password !== password ||
      post.author.username !== username ||
      String(post.author._id) !== id
    ) {
      throw new UserInputError("Not allowed");
    }

    post.body = body;
    await post.save();

    return { ...post._doc, id: post._id };
  },

  async likePost(_: Obj, { postId }: Obj, context: Obj) {
    const token = getToken(context);
    const decodedToken: UserToken = decodeToken(token);

    const post: Post = await Post.findById(postId);

    const likeIndex = post.likes.findIndex(
      ({ author }) => String(author) === String(decodedToken.id)
    );

    if (likeIndex === -1) {
      post.likes.push({ author: decodedToken.id });
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await (post as any).save();
    return "liked";
  },
};

const postQuery = {
  async posts(_: Obj, { authorUsername, postsLength }: Obj, context: Obj) {
    const token = getToken(context, false);
    const decodedToken = token ? decodeToken(token) : null;

    if (decodedToken) await validateUserToken(decodedToken);

    const posts: Post[] = await (authorUsername
      ? Post.find({ author: await User.findOne({ username: authorUsername }) })
      : Post.find()
    )
      .sort({ createdAt: -1 })
      .skip(postsLength || 0)
      .populate("author")
      .limit(10);

    return posts.map(post => ({
      ...(post as any)._doc,
      id: post._id,
      liked: post.likes.some(
        ({ author }) => String(author) === String(decodedToken?.id)
      ),
    }));
  },

  async post(_: Obj, { postId }: Obj) {
    const post = await Post.findById(postId).populate("author");
    return { ...post._doc, id: post._id };
  },
};

export default { Mutation: postMutation, Query: postQuery };
