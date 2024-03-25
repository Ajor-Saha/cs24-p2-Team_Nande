import mongoose, { Schema } from 'mongoose';

const stsSchema = new Schema({
    ward_number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    coordinates: {
        type: { type: String },
        coordinates: [Number]
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

stsSchema.index({ coordinates: '2dsphere' });

export const STS = mongoose.model('STS', stsSchema);


