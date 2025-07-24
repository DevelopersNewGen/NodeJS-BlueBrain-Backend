import publicTutorial from './publicTutorial.model.js';
import axios from "axios";

export const getPublicTutorials = async (req, res) => {
    try {
        const tutorials = await publicTutorial.find().populate('tutor subject');
        return res.status(200).json({
            success: true,
            message: 'Public tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving public tutorials'
        });
    }
}

export const getPublicTutorialById = async (req, res) => {
    const { ptid } = req.params;

    try {
        const tutorial = await publicTutorial.findById(ptid).populate('tutor', 'subject');
        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Public tutorial not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Public tutorial retrieved successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving public tutorial'
        });
    }
}

export const createTeamsMeeting = async (accessToken, subject, startDateTime, endDateTime) => {
    try {
        const response = await axios.post(
            'https://graph.microsoft.com/v1.0/me/onlineMeetings',
            {
                subject,
                startDateTime,
                endDateTime
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.joinUrl;
    } catch (error) {
        console.error('Teams API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error; 
    }
};

export const updateStatus = async (req, res) => {
    const { ptid } = req.params;
    const { newStatus, date } = req.body;

    try {
        const tutorial = await publicTutorial.findById(ptid);

        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Public tutorial not found'
            });
        }

        if (tutorial.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Public tutorial is not pending'
            });
        }

        tutorial.status = newStatus;
        if (newStatus === 'COMPLETED') {
            tutorial.date = date || new Date();
            tutorial.time = date.toLocaleTimeString();
        }

        await tutorial.save();

        return res.status(200).json({
            success: true,
            message: 'Public tutorial status updated successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating public tutorial status'
        });
    }
}

export const getTutorialByStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const tutorials = await publicTutorial.find({ student: studentId })
            .populate('tutor subject')
            .sort({ createdAt: -1 });

        if (!tutorials || tutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No private tutorials found for this student'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Private tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving private tutorials for student'
        });
    }
}

export const getMyPublicTutorials = async (req, res) => {
    const usuario = req.usuario;

    try {
        const tutorials = await publicTutorial.find({ student: usuario._id })
            .populate('tutor subject')
            .sort({ createdAt: -1 });

        if (!tutorials || tutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No public tutorials found for this user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Public tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving public tutorials for user'
        });
    }
}