import mongoose from 'mongoose';

const stsEntryForContractorSchema = new mongoose.Schema({
    timeAndDateOfCollection: {
        type: Date,
        required: true,
    },
    amountOfWasteCollected: {
        type: Number,
        required: true,
    },
    contractorID: {
        type: String,
        required: true,
    },
    typeOfWasteCollected: {
        type: String,
        enum: ['Domestic', 'Plastic', 'Construction Waste'],
        required: true,
    },
    designatedSTSForDeposit: {
        type: Number,
        required: true,
    },
    vehicleUsedForTransportation: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const STSEntryContractor = mongoose.model('STSEntryContractor', stsEntryForContractorSchema);


