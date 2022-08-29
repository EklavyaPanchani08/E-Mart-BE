import 'dotenv/config'
import { error, success } from "consola"
import { ApolloServer, gql } from "apollo-server-express"
import resolvers from './resolvers/index'
import typeDefs from './schema/index'
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import express from 'express';
import models from './models'
// import { insertPredefineData } from "./fixture"
const app = express();


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));



const getMe = async (req) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const me = await jwt.verify(token, process.env.SECRET);
      return await models.User.findById(me.id).populate('roleId')
    } catch (e) {
      throw new AuthenticationError("Session Invalid or expired.");
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection, res }) => {
    if (connection) {
      return {
        models,
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
      };
    }
  }
})

const startApp = () => {
  try {
    mongoose.connect('mongodb://localhost:27017/E-mart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(async () => {
        // await insertPredefineData(models)
        let role = await models.Role.findOne({ roleName: 'admin' });
        if (!role) {
            role = await models.Role.create({
                roleName: "admin"
            })
        }

        setTimeout(async () => {
            const user = await models.User.findOne({  email: "admin@gmail.com" });
            if (!user) {
                models.User.create({
                    email: "admin@gmail.com",
                    password: "admin@gmail.com",
                    roleId: role._id
                });
            }
        }, 2000
        )
        console.log("Connection Successfully")
        //role find if not getting role then add role
        // role find, admin find if not getting admin then add admin
        await server.start();
        server.applyMiddleware({ app });

        app.listen(process.env.PORT, () => success({
          badge: true,
          message: `Server started on http://localhost:${process.env.PORT}/graphql`
        }));
      })
      .catch((e) => console.log(e.message))

  } catch (error) {
    console.log(error);
    error({ message: err.message, badge: true })
  }
}

startApp();


