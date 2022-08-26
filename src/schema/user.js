import { gql } from "apollo-server-express";

export default gql`
type Token {
  token: String
  user: User
}
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
    gender: String
    isActive: Boolean
    isVerified: Boolean
    isApproved: Boolean
    createdBy: ID
    updatedBy: ID
    createdAt: Date
    updatedAt: Date
  }
  type UserRes {
    id: ID
    firstName: String
    lastName: String
    email: String
    gender: String
    isActive: Boolean
    isVerified: Boolean
    isApproved: Boolean
    createdBy: ID
    updatedBy: ID
    createdAt: Date
    updatedAt: Date
  }

  input UserInput {
    firstName: String
    lastName: String
    email: String
    gender: String
  }


  extend type Mutation {
    createUser(input: UserInput): User
    signIn(email: String, password: String): Token
  }
`;
