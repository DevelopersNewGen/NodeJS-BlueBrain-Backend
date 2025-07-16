import privTutorial from "./privTutorial.model.js";
import axios from "axios";

export const getPrivTutorials = async (req, res) => {
    try {
        const tutorials = await privTutorial.find().populate('tutor subject');
        return res.status(200).json({
            success: true,
            message: 'Private tutorials retrieved successfully',
            data: tutorials
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving private tutorials'
        });
    }
}

export const getPrivTutorialById = async (req, res) => {
    const { ptid } = req.params;
    try {
        const tutorial = await privTutorial.findById(ptid).populate('tutor subject');
        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Private tutorial not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Private tutorial retrieved successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving private tutorial'
        });
    }
}

export const createTeamsMeeting = async (accessToken, subject, startDateTime, endDateTime) => {
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
};

export const updateStatus = async (req, res) => {
    const { ptid } = req.params;
    const { newStatus, date } = req.body;

    try {
        const tutorial = await privTutorial.findById(ptid);

        if (!tutorial) {
            return res.status(404).json({
                success: false,
                message: 'Private tutorial not found'
            });
        }

        if (tutorial.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Private tutorial is not pending'
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
            message: 'Private tutorial status updated successfully',
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error updating private tutorial status'
        });
    }
}

export const acceptPrivTutorial = async (req, res) => {
    const { ptid } = req.params;
    const { date, duration } = req.body;
    const usuario = req.usuario; 

    try {
        const tutorial = await privTutorial.findById(ptid);
        if (!tutorial) {
            return res.status(404).json({ 
                success: false,
                 message: "Tutorial not found" 
                });
        }

        const startDateTime = date || new Date();
        const endDateTime = new Date(new Date(startDateTime).getTime() + (duration || 60) * 60000).toISOString();
        const joinUrl = await createTeamsMeeting(
            usuario.graphToken,
            tutorial.topic,
            new Date(startDateTime).toISOString(),
            endDateTime
        );

        tutorial.meetingLink = joinUrl;
        tutorial.status = "ACCEPTED";
        await tutorial.save();

        return res.status(200).json({
            success: true,
            message: "Teams meeting created and tutorial accepted",
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error accepting tutorial" });
    }
};

