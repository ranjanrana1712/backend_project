const express = require('express');
const router = express.Router();
const jobSchema = require('../schema/job.schema');

router.post('/', async (req, res) => {
    try {
        const jobInfo = req.body;
        const skills = jobInfo?.skills?.split(',') || []; //spilts the strings into array of strings
        const newSkill = skills.map(skill => skill.trim()); //removes any leading whitspace or leading
        jobInfo = newSkill;
        const user = req.user;
        jobInfo.userId = user._id;
        const job = new jobSchema(jobInfo);
        await job.save();
        res.json(job).status(200);
    } catch (error) {
        return new Error(error.messsage)

    }
})

module.exports = router;
