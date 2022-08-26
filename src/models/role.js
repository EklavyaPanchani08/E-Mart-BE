import mongoose from "mongoose";


const roleSchema = new mongoose.Schema({
    roleName: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Role = mongoose.model('role', roleSchema)


export default Role;