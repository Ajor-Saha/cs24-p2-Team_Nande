import mongoose, { Schema } from 'mongoose';

const stsSchema = new Schema({
    ward_number: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    gps_coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    operationalTimespan: {
        startTime: {
            type: String, 
            required: true
        },
        endTime: {
            type: String, 
            required: true
        }
    },
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    vehicles: [{
        type: Number, 
        required: true
    }],
    fine: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });


export const STS = mongoose.model('STS', stsSchema);


