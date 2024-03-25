import mongoose, { Schema } from 'mongoose';

const vehicleSchema = new Schema({
    vehicle_number: {
        type: Number,
        unique: true,
    },
    type: {
        type: String,
        enum: ['Open Truck', 'Dump Truck', 'Compactor', 'Container Carrier'],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    
}, { timestamps: true });


export const Vehicle = mongoose.model('Vehicle', vehicleSchema);


