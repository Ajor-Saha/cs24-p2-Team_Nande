import mongoose, { Schema } from 'mongoose';

const landfillEntrySchema = new Schema({
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    dumping: {
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
    }
}, { timestamps: true });

export const LandfillEntry = mongoose.model('LandfillEntry', landfillEntrySchema);

