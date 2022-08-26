import { gql } from 'apollo-server-express'


export default gql`

type Role{
    id:ID
    roleName:String
    isActive:Boolean
    isDeleted:Boolean
    createdAt:Date
    updatedAt:Date
}
input roleInput{
    roleName:String
}

extend type Query  {
    getRole(id:ID!):Role
    getAllRole:[Role]
}   
extend type Mutation{
    createRole(input:roleInput!):Role
    editRole(input:roleInput!, id:ID! ):Role
}


`