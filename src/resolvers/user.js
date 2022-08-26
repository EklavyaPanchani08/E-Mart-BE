import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from "./auth";
const generateToken = async (user, expiresIn) => {
  const { id, email } = user;
  const token = await jwt?.sign({ id, email }, process.env.SECRET, {
    expiresIn,
  });
  console.log("token", token);
  return token;
};

export default {
  Mutation: {
    signIn: async (_, { email, password }, { models }) => {
      console.log("it call");
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

    createUser:combineResolvers(isAuthenticated,(_,{input},{models,me})=>{
        return new Promise((resolve,reject)=>{
            models?.User.findOne({email:input?.email}).exec((err,res)=>{
                if (err) reject(err);
					else if (res) reject("This email is already exits.");
                    else{
						input.createdBy = me?.id;
                        models?.User?.create(input,(err,res)=>{
                            if(err)reject(err)
                            else resolve(res)
                        })

                    }
            })
        })
    })
  },
};
