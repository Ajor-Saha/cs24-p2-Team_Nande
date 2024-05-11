import mongoose from 'mongoose';

const workHoursSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    logInTime: {
        type: String,
        require: true
    },
    logOutTime: {
        type: String,
        required: true,
    },
    totalHoursWorked: {
        type: Number,
        default: 0,
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    absences: {
        type: Number,
        default: 0,
    },
    leaves: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const WorkedHour = mongoose.model('WorkedHour', workHoursSchema);


