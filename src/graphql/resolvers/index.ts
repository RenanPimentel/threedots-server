import userResolver from "./userResolver";
import postResolver from "./postResolver";

const resolvers = {
  Post: {
    likeCount: (post: any) => post.likes.length,
  },

  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
  },
  Query: {
    ...postResolver.Query,
    ...userResolver.Query,
  },
};

export default resolvers;
