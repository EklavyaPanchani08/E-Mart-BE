import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new AuthenticationError('You are not authenticated as a user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { roleId} }) => roleId.roleName === "admin" ? skip : new AuthenticationError('You are not authenticated as a admin.')
);  

export const isFaculty = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { roleId} }) => {
    roleId.roleName === "faculty" ? skip : new AuthenticationError('You are not authenticated as a faculty.')
  }
) 

export const isLibrarian = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { roleId} }) => {
    roleId.roleName === "librarian" ? skip : new AuthenticationError('You are not authenticated as a faculty.')
  }
) 