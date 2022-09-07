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
          password: String
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
     type UserPaginate {
          count: Int
          data: [User]
     }

     input UserInput {
          firstName: String
          lastName: String
          email: String
          password: String
          gender: String
     }

     extend type Query {
          getAllUser(
               page: Int
               limit: Int
               sort: Sort
               search: String
          ): UserPaginate
          getUser: [User]
     }

     extend type Mutation {
          createUser(input: UserInput): User
          signIn(email: String, password: String): Token
          updateUser(input: UserInput): User
          deleteUser(id: ID): Boolean
     }
`;
