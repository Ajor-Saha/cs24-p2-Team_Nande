import mongoose, { Schema } from 'mongoose';

const companyVehicleSchema = new Schema({
    vehicle_reg_number: {
        type: Number,
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Rickshaw', 'Mini Truck'],
        required: true,
    }, 
    
}, { timestamps: true });


export const CompanyVehicle = mongoose.model('CompanyVehicle', companyVehicleSchema);


