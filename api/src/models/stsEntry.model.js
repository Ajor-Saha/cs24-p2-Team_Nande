import mongoose, { Schema } from 'mongoose';

const stsEntrySchema = new Schema({
    sts_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'STS',
        required: true
    },
    vehicle_number: {
        type: String,
        required: true
    },
    volume_of_waste: {
        type: Number,
        required: true
    },
    time_of_arrival: {
        type: Date,
        required: true
    },
    time_of_departure: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const STSEntry = mongoose.model('STSEntry', stsEntrySchema);


