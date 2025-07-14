import Tutorial from "./tutorial.model.js";
import User from "../user/user.model.js";
import privTutorial from "../privTutorial/privTutorial.model.js";
import { createPrivTutorial } from "../privTutorial/privTutorial.controller.js";

export const getTutorials = async (req, res) => {
    try {
        await Tutorial.updateMany(
            { endTime: { $lt: new Date() }, status: { $ne: "EXPIRED" } },
            { $set: { status: "EXPIRED" } }
        );

        const tutorials = await Tutorial.find().populate('host', 'name email profilePicture');
        return res.status(200).json({
            success: true,
            message: 'Tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tutorials'
        });
    }
}

export const getTutorialById = async (req, res) => {
    const { tid } = req.params;
    try {
        const tutorial = await Tutorial.findById(tid).populate('host', 'name email profilePicture');
        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Tutorial retrieved successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tutorial'
        });
    }
}

export const createTutorial = async (req, res) => {
    try {
        const { topic, description, startTime, endTime, subject, access } = req.body;
        const { usuario } = req;

        const user = await User.findById(usuario._id);

        if (user.subjects.includes(subject) === false) {
            return res.status(400).json({
                success: false,
                message: 'User is not enrolled in this subject'
            });
        }

        const newTutorial = new Tutorial({
            host: usuario._id,
            subject,
            access,
            topic,
            description,
            startTime,
            endTime
        });

        await newTutorial.save();
        
        return res.status(201).json({
            success: true,
            message: 'Tutorial created successfully',
            data: newTutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating tutorial'
        });
    }
}

export const updateTutorial = async (req, res) => {
    const { tid } = req.params;
    const { topic, description, startTime, endTime } = req.body;

    try {
        const updatedTutorial = await Tutorial.findByIdAndUpdate(tid, {
            topic,
            description,
            startTime,
            endTime
        }, { new: true });

        if (!updatedTutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tutorial updated successfully',
            data: updatedTutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating tutorial'
        });
    }
}

export const deleteTutorial = async (req, res) => {
    const { tid } = req.params;

    try {
        const deletedTutorial = await Tutorial.findByIdAndDelete(tid);
        if (!deletedTutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tutorial deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting tutorial'
        });
    }
}

export const getTutorialsByHost = async (req, res) => {
    const { uid } = req.params;

    try {
        const tutorials = await Tutorial.find({ host: uid }).populate('host', 'name email profilePicture');
        if (tutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tutorials found for this host'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tutorials for host'
        });
    }
}

export const getTutorialsBySubject = async (req, res) => {
    try {
        const { sid } = req.params;
        const tutorials = await Tutorial.find({ subject: sid }).populate('host', 'name email profilePicture');
        if (tutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tutorials found for this subject'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tutorials for subject'
        });
    }
}

export const acceptTutorial = async (req, res) => {
    const { tid } = req.params;
    const { usuario } = req;
    const { newStatus, date } = req.body;

    try {
        const tutorial = await Tutorial.findById(tid);

        const host = await User.findById(tutorial.host);

        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }

        if (tutorial.status !== 'INCOURSE') {
            return res.status(400).json({
                success: false,
                message: 'Tutorial is not in progress'
            });
        }

        if (tutorial.host.toString() === usuario._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Host cannot accept their own tutorial'
            });
        }

        if (tutorial.status === 'FULL') {
            return res.status(400).json({
                success: false,
                message: 'Tutorial is full'
            });
        }

        tutorial.status = newStatus;

        tutorial.participants.push(usuario._id);

        if (tutorial.participants.length >= 10) {
            tutorial.status = 'FULL';
        }

        if (tutorial.access === 'PRIVATE') {
            const tutorialDate = date || new Date();
            const link = await createPrivTutorial(host, tutorialDate, tutorial.topic);

            const newPrivTutorial = new privTutorial({
                host: tutorial.host,
                subject: tutorial.subject,
                date: tutorialDate,
                time: tutorialDate.toLocaleTimeString(),
                meetingLink: link,
                status: 'PENDING',
            });

            await newPrivTutorial.save();
        }

        await tutorial.save();

        return res.status(200).json({
            success: true,
            message: 'Tutorial accepted successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error accepting tutorial'
        });
    }
}