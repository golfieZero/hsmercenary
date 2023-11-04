import mongoose from 'mongoose'

const abilitySchema = new mongoose.Schema({
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true },
    description: { type: String, required: true },
});

export default mongoose.model('Ability', abilitySchema);