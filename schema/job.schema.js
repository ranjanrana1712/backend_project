const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    monthlySalary: {
        type: number,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contract', 'Freelance']

    },
    remote: {
        type: Boolean,
        required: true
    },
    location: {
        type: string,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    skills: {
        type: array,
        required: true
    },
    information: {
        type: String,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('job', jobSchema);