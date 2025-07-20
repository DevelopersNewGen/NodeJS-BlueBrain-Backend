import Tutorial from "./tutorial.model.js";
import User from "../user/user.model.js";
import privTutorial from "../privTutorial/privTutorial.model.js";

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
            message: 'Error creating tutorial',
            error: error.message
        });
    }
}

export const requestTutorial = async (req, res) => {
    const { tid } = req.params;
    const { usuario } = req;
    try {
        const { startTime, endTime} = req.body;

        const tutorial = await Tutorial.findById(tid);

        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Tutorial not found'
            });
        }

        if (tutorial.status !== 'INCOURSE') {
            return res.status(400).json({
                success: false,
                message: 'Tutorial is not available for requests'
            });
        }
        
        if (tutorial.host.toString() === usuario._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot request your own tutorial'
            });
        }

        if (tutorial.access === 'PRIVATE') {
            const newPrivTutorial = new privTutorial({
                tutor: tutorial.host, 
                student: usuario._id,
                subject: tutorial.subject,
                topic: tutorial.topic,
                description: tutorial.description,
                scheduledDate: startTime,
                scheduledEndTime: endTime,
                status: 'PENDING',
                relatedTutorial: tid
            });
            await newPrivTutorial.save();
        }


        return res.status(201).json({
            success: true,
            message: 'Private tutorial request created successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error requesting tutorial',
            error: error.message
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

