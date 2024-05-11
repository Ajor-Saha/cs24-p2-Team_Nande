import mongoose, { Schema } from 'mongoose';

const contractorSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    contractId: {
        type: String,
        required: true,
        unique: true,
    },
    registrationId: {
        type: String,
        required: true,
        unique: true,
    },
    registrationDate: {
        type: Date,
        required: true,
    },
    tin: {
        type: Number,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    workforceSize: {
        type: Number,
        required: true,
    },
    paymentPerTonnage: {
        type: Number,
        required: true,
    },
    requiredWastePerDay: {
        type: Number,
        required: true,
    },
    contractDuration: {
        type: Number,
        required: true,
    },
    areaOfCollection: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    designatedSTS: {
        type: Number,
        require: true,
    },
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    vehicles: [{
        type: Number, 
    }],
    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker' 
    }]

}, { timestamps: true });



export const Contractor = mongoose.model('Contractor', contractorSchema);


