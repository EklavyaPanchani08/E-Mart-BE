import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import mongoosePaginate from 'mongoose-paginate'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        index: true,
        trim: true,
        require: true
    },
    photo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        trim: true
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

}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('user', userSchema)


export default User;