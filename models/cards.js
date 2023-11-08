import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    abilities: [
        {
            name: String,
            description: String,
            level: Number,
        },
    ],
});

export default mongoose.model('Card', cardSchema);

