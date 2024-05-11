import mongoose from 'mongoose';

const wasteCollectionPlanSchema = new mongoose.Schema({
    areaOfCollection: {
        type: String,
        required: true
    },
    collectionStartTime: {
        type: Date,
        required: true
    },
    durationForCollection: {
        type: Number, // Duration in hours or minutes, depending on the requirement
        required: true
    },
    numberOfLaborers: {
        type: Number,
        required: true
    },
    numberOfVans: {
        type: Number,
        required: true
    },
    expectedWeightOfDailyWaste: {
        type: Number, // Weight in kilograms or any suitable unit
        required: true
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the schedule
        required: true
    }
}, { timestamps: true });

export const WasteCollectionPlan = mongoose.model('WasteCollectionPlan', wasteCollectionPlanSchema);
