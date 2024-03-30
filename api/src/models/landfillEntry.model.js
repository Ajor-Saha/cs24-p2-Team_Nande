import mongoose, { Schema } from 'mongoose';

const landfillEntrySchema = new Schema({
    vehicle_reg_number: {
        type: Number,
        required: true,
    },
    weight_of_waste: {
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
    },
    distance_traveled: {
        type: Number,
        required: true
    }
}, { timestamps: true });


export const LandfillEntry = mongoose.model('LandfillEntry', landfillEntrySchema);


