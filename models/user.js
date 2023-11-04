import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)