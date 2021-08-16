import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { MONGODB_URI, PORT } from "./config/index";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: reqAndRes => ({ ...reqAndRes }),
});

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => server.listen({ port: PORT || 4000 }))
  .then(serverOptions => console.log(`Server ready at ${serverOptions.url}`))
  .catch(err => console.log({ err }));
