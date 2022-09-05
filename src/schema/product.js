import { gql } from "apollo-server-express";

export default gql`

type Product{
    id: ID
    name: String
    photo : [String]
    category: String
    color: String
    isActive: Boolean
    isVerified: Boolean
    isApproved: Boolean
    createdBy: ID
    updatedBy: ID
    createdAt: Date
    updatedAt: Date
}

    input ProductInput{
	id: ID
    name: String
    photo : [String]
    category: String
    color: String
    }

    extend type Query  {
        getAllProduct:[Product]
    }

    extend type Mutation{
        createProduct(input:ProductInput):Product
        updateProduct(input:ProductInput):Product
        deleteProduct(id: ID):Boolean
    }

`