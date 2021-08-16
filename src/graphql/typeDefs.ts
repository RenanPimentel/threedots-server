import { gql } from "apollo-server";

export default gql`
  type UserWithToken {
    avatar: String!
    createdAt: String!
    token: String!
    username: String!
  }

  type User {
    avatar: String!
    createdAt: String!
    username: String!
  }

  type Post {
    id: ID!
    author: User!
    body: String!
    createdAt: String!
    # comments: [Comment]!
    liked: Boolean!
    likeCount: Int!
  }

  type Comment {
    author: User!
    body: String!
  }

  type Like {
    author: User!
    body: String!
  }

  type Query {
    posts(postsLength: Int, authorUsername: String): [Post]!
    post(postId: ID!): Post!
    user(username: String!): User!
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): UserWithToken!
    login(username: String!, password: String!): UserWithToken!

    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    updatePost(postId: ID!, body: String!): Post!
    likePost(postId: ID!): String!
  }
`;
