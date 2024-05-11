import mongoose, { Schema } from 'mongoose';

const contructorEntrySchema = new Schema({
    vehicle_reg_number: {
        type: Number,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    weightOfWaste: {
        type: Number,
        required: true,
    }
    
}, { timestamps: true });


export const ContractorEntry = mongoose.model('ContractorEntry', contructorEntrySchema);


