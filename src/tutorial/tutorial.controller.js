import Tutorial from "./tutorial.model.js";
import User from "../user/user.model.js";
import privTutorial from "../privTutorial/privTutorial.model.js";
import publicTutorial from "../publicTutorial/publicTutorial.model.js";
import Subject from "../subject/subject.model.js";
import { createTeamsMeeting } from "../publicTutorial/publicTutorial.controller.js";
import { DateTime } from 'luxon';

export const getTutorials = async (req, res) => {
    try {
        await Tutorial.updateMany(
            { endTime: { $lt: new Date() }, status: { $ne: "EXPIRED" } },
            { $set: { status: "EXPIRED" } }
        );

        const tutorials = await Tutorial.find().populate('host', 'name email profilePicture').populate("subject", "name code img");
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
        const tutorial = await Tutorial.findById(tid).populate('host', 'name email profilePicture').populate("subject", "name code img");
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
        const subjectRelated = await Subject.findById(subject);

        const isTeacher = subjectRelated.teachers.includes(usuario._id);
        const isTutor = subjectRelated.tutors.includes(usuario._id);

        if (!isTeacher && !isTutor) {
            return res.status(400).json({
                success: false,
                message: 'User is not a teacher or tutor of this subject'
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

        if (access === 'PUBLIC') {
            let meetingLink = null;
            let currentToken = user.graphToken;
            
            if (currentToken) {
                try {
                    const localStart = DateTime.fromJSDate(new Date(startTime), {
                        zone: 'America/Guatemala'
                    });
                    const localEnd = DateTime.fromJSDate(new Date(endTime), {
                        zone: 'America/Guatemala'
                    });

                    meetingLink = await createTeamsMeeting(
                        currentToken,
                        `${topic} - ${subject}`,
                        localStart.toUTC().toISO(),
                        localEnd.toUTC().toISO()
                    );
                } catch (error) {
                    console.error('Error creating Teams meeting:', error.response?.data || error.message);
                    
                    if (error.response?.status === 401 && user.refreshToken) {
                        try {
                            const newToken = await refreshUserToken(user.refreshToken);
                            
                            await User.findByIdAndUpdate(usuario._id, { 
                                graphToken: newToken 
                            });
                                                        
                            meetingLink = await createTeamsMeeting(
                                newToken,
                                `${topic} - ${subject}`,
                                localStart.toUTC().toISO(),
                                localEnd.toUTC().toISO()
                            );
                        } catch (refreshError) {
                            console.error('Error refreshing token:', refreshError.response?.data || refreshError.message);
                        }
                    }
                }
            }

            const newPublicTutorial = new publicTutorial({
                tutor: usuario._id,
                students: [], 
                subject,
                topic,
                description,
                scheduledDate: startTime,
                scheduledEndTime: endTime,
                relatedTutorial: newTutorial._id,
                meetingLink: meetingLink
            });
            
            await newPublicTutorial.save();
        }

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

const refreshUserToken = async (refreshToken) => {
    try {
        const response = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.AZURE_CLIENT_ID,
                client_secret: process.env.AZURE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                scope: 'openid profile email User.Read Files.ReadWrite OnlineMeetings.ReadWrite offline_access'
            })
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

export const requestTutorial = async (req, res) => {
    const { tid } = req.params;
    const { usuario } = req;

    try {
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
            const { startTime, endTime } = req.body;

            const localStart = DateTime.fromJSDate(new Date(startTime), {
                zone: 'America/Guatemala'
            });
            const localEnd = DateTime.fromJSDate(new Date(endTime), {
                zone: 'America/Guatemala'
            });

            const newPrivTutorial = new privTutorial({
                tutor: tutorial.host,
                student: usuario._id,
                subject: tutorial.subject,
                topic: tutorial.topic,
                description: tutorial.description,
                scheduledDate: localStart.toJSDate(),
                scheduledEndTime: localEnd.toJSDate(),
                status: 'PENDING',
                relatedTutorial: tid
            });
            await newPrivTutorial.save();
        }

        if (tutorial.access === 'PUBLIC') {
            const existingPublicTutorial = await publicTutorial.findOne({ relatedTutorial: tid });
            
            if (!existingPublicTutorial) {
                return res.status(404).json({
                    success: false,
                    message: 'Public tutorial not found'
                });
            }

            if (existingPublicTutorial.students.includes(usuario._id)) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already registered for this tutorial'
                });
            }

            existingPublicTutorial.students.push(usuario._id);
            await existingPublicTutorial.save();
        }

        return res.status(201).json({
            success: true,
            message: 'Tutorial request created successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error requesting tutorial',
            error: error.message
        });
    }
};

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

export const getMyTutorialsTutor = async (req, res) => {
    const { usuario } = req;

    try {
        await privTutorial.updateMany(
            { 
                scheduledEndTime: { $lt: new Date() }, 
                status: { $in: ["PENDING", "ACCEPTED"] }
            },
            { $set: { status: "COMPLETED" } }
        );

        await publicTutorial.updateMany(
            { 
                scheduledEndTime: { $lt: new Date() }, 
                status: { $in: [ "PENDING"] }
            },
            { $set: { status: "COMPLETED" } }
        );

        const privTutorials = await privTutorial.find({ tutor: usuario._id })
            .populate('tutor', 'name email profilePicture')
            .populate('subject', 'name code img')
            .populate('student', 'name email profilePicture')
            .sort({ scheduledDate: -1 });

        const publicTutorials = await publicTutorial.find({ tutor: usuario._id })
            .populate('tutor', 'name email profilePicture')
            .populate('subject', 'name code img')
            .populate('students', 'name email profilePicture')
            .sort({ scheduledDate: -1 });

        const allTutorials = [...privTutorials, ...publicTutorials];

        if (allTutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tutorials found for this tutor'
            });
        }

        allTutorials.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

        return res.status(200).json({
            success: true,
            message: 'Tutorials retrieved successfully',
            data: {
                total: allTutorials.length,
                private: privTutorials.length,
                public: publicTutorials.length,
                tutorials: allTutorials
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving tutorials for tutor'
        });
    }
}