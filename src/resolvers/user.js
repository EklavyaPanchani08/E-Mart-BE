import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from "./auth";
import { FilterQuery } from './../functions/generateFilterQuery';
import { fileUpload } from "../functions/fileUpload";
const generateToken = async (user, expiresIn) => {
  const { id, email } = user;
  const token = await jwt?.sign({ id, email }, process.env.SECRET, {
    expiresIn,
  });
  return token;
};

export default {
  Query: {
    // getAllEducation with paginate
    getAllUser: combineResolvers(isAuthenticated, (parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        const filterText = FilterQuery(args?.search, "userTbl");
        const sort = { [args?.sort?.key]: args?.sort?.type };
        const option = { page: args?.page, limit: args?.limit, sort };
        models?.User?.paginate({ ...filterText, isDeleted: false }, option, (err, results) => {
          if (err) reject(err);
          resolve({ count: results?.total || 0, data: results?.docs || [] });
        });
      });
    }),

    // getAllEducation without paginate
    getUser: combineResolvers((parent, args, { models }) => {
      return new Promise((resolve, reject) => {
        models?.User?.find({ isDeleted: false }).exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    }),
  },
  Mutation: {
    signIn: async (_, { email, password }, { models }) => {
      const user = await models.User.findOne({ email });
      if (!user) {
        throw new UserInputError("Email not found.");
      }
      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new UserInputError("Invalid Password.");
      }
      return {
        token: generateToken(user, "7h"),
        user: user,
      };
    },

    createUser: combineResolvers((_, { input }, { models }) => {
      return new Promise(async (resolve, reject) => {
        input.photo = await fileUpload(input.photo)
        models?.User.findOne({ email: input?.email, isDeleted: false }).exec((err, res) => {
          if (err) reject(err);
          else if (res) reject("This email is already exits.");
          else {
            // input.createdBy = me?.id;
            models?.User?.create(input, (err, res) => {
              if (err) reject(err)
              else resolve(res)
            })

          }
        })
      })
    }),

    updateUser: combineResolvers((_, { input }, { models, me }) => {
      return new Promise((resolve, reject) => {
        models?.User?.findOneAndUpdate({ _id: me?.id, isDeleted: false }, input, { new: true }, (err, res) => {
          if (err) reject(err)
          else resolve(res)
        })
      })
    }),
    deleteUser: combineResolvers((_, { id }, { models }) => {
      return new Promise((resolve, reject) => {
        models?.User?.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }, (err, res) => {
          if (err) reject(err)
          else if (!res) resolve("This user not found.")
          else resolve(true)
        })
      })
    })

  },
};
