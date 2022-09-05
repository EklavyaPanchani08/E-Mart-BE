import { gql } from 'apollo-server-express'

import RoleSchema from './role'
import UserSchema from './user'
import ProductSchema from './product'


const linkSchema = gql`
    scalar Date
    scalar JSON
    scalar Number


    type Query {
        _ : Boolean
    }

    type Mutation {
        _ : Boolean
    }

    input Sort {
        key : String,
        type : Int
    }
   
`;





export default [
    linkSchema,
    RoleSchema,
    UserSchema,
    ProductSchema

]