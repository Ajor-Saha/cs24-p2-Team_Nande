import mongoose, { Schema } from 'mongoose';

const vehicleSchema = new Schema({
    vehicle_reg_number: {
        type: Number,
        required: true,
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
    fuel_cost_loaded: {
        type: Number,
        required: true,
    },
    fuel_cost_unloaded: {
        type: Number,
        required: true,
    },
    
}, { timestamps: true });


export const Vehicle = mongoose.model('Vehicle', vehicleSchema);


