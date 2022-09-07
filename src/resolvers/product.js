import { combineResolvers } from "graphql-resolvers";
import { fileUpload } from "../functions/fileUpload";
import { FilterQuery } from './../functions/generateFilterQuery';

export default {
    Query: {
        getAllProduct: (parent, args, { models }) => {
            return new Promise((resolve, reject) => {
                const filterText = FilterQuery(args?.search, "producttbl");
                const sort = { [args?.sort?.key]: args?.sort?.type };
                const option = { page: args?.page, limit: args?.limit, sort };
                models?.Product?.paginate({ ...filterText, isDeleted: false }, option, (err, results) => {
                    if (err) reject(err);
                    resolve({ count: results?.total || 0, data: results?.docs || [] });
                });
            });
        },
        getProduct: combineResolvers((parent, { id }, { models }) => {
            return new Promise((resolve, reject) => {
                models?.Product?.findOne({ _id: id, isDeleted: false }).exec((err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        }),

    },
    Mutation: {
        createProduct: (parent, { input }, { models }) => {
            return new Promise(async (resolve, reject) => {
                const photo = [];
                if (input?.photo) {
                    await Promise.all(
                        input?.photo?.map(async (val) => {
                            const productImage = await fileUpload(val);
                            photo.push(productImage);
                            return productImage;
                        })
                    );
                    input.photo = photo;
                }
                // input.photo = await fileUpload(input.photo);
                models.Product.create(input, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                })
            });
        },
        updateProduct: (parent, { input }, { models }) => {
            return new Promise(async (resolve, reject) => {
                const photo = [];
                if (input?.photo) {
                    await Promise.all(
                        input?.photo?.map(async (val) => {
                            const productImage = await fileUpload(val);
                            photo.push(productImage);
                            return productImage;
                        })
                    );
                    input.photo = photo;
                }
                models?.Product?.findOneAndUpdate({ _id: input?.id, isDeleted: false }, input, { new: true }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                })
            })
        },
        deleteProduct: (parent, { id }, { models }) => {
            return new Promise(async (resolve, reject) => {
                models?.Product?.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true }, (err, res) => {
                    if (err) reject(err);
                    else resolve(true);
                })
            })
        },
    }
}