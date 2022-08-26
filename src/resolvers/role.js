import { combineResolvers } from "graphql-resolvers"
import { isAdmin } from "./auth"

export default {
    Query: {
        getRole: combineResolvers(isAdmin, (_, { id }, { models }) => {
            return new Promise(async (resolve, reject) => {
                const role = await models.Role.findById(id)
                if (!role) {
                    reject("Role not found")
                } else {
                    resolve(role)
                }
            })
        }),
        getAllRole: combineResolvers( (_, args, { models }) => {
            return new Promise(async (resolve, reject) => {
                const role = await models.Role.find({ isDeleted: false })
                if (!role.length) {
                    reject("Role not found.")
                } else {
                    resolve(role)
                }
            })
        })

    },

    Mutation: {
        createRole: combineResolvers(isAdmin, (_, { input }, { models }) => {
            return new Promise(async (resolve, reject) => {
                const { roleName } = input
                const role = await models.Role.findOne({ roleName })
                if (role) {
                    reject("Role is already exist")
                } else {
                    const role2 = await models.Role.create(input)
                    resolve(role2)
                }
            })
        }),
        editRole: combineResolvers(isAdmin, (_, { input, id }, { models }) => {
            return new Promise(async (resolve, reject) => {
                const role = await models.Role.findByIdAndUpdate(id, input, { new: true })
                if (!role) {
                    reject("Role not found.")
                } else {
                    resolve(role)
                }
            })
        })


    }
}