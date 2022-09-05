import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    photo: [String],
    category: {
        type: String,
        enum: ["male", "female", 'children'],
    },
    color: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"

    }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('product', productSchema)

export default Product;
