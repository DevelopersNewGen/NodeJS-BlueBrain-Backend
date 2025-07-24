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
    const usuario = req.usuario; 

    try {
        const tutorial = await privTutorial.findById(ptid).populate('subject', 'name');
        
        if (!tutorial) {
            return res.status(404).json({ 
                success: false,
                message: "Private tutorial not found" 
            });
        }

        if (tutorial.status !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'Private tutorial is not pending'
            });
        }

        if (tutorial.tutor.toString() !== usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the tutor who created this tutorial can accept it'
            });
        }

        const finalDate = tutorial.scheduledDate ? new Date(tutorial.scheduledDate) : tutorial.scheduledDate;
        const tutorialDuration = 60;
        
        const startDateTime = finalDate.toISOString();
        const endDateTime = new Date(finalDate.getTime() + tutorialDuration * 60000).toISOString();

        let meetingLink = null;
        let currentToken = usuario.graphToken;
        
        if (currentToken) {
            try {
                meetingLink = await createTeamsMeeting(
                    currentToken,
                    `${tutorial.topic} - ${tutorial.subject.name}`,
                    startDateTime,
                    endDateTime
                );
                console.log('Teams meeting created successfully:', meetingLink);
            } catch (error) {
                console.error('Error creating Teams meeting:', error.response?.data || error.message);
                
                if (error.response?.status === 401 && usuario.refreshToken) {
                    console.log('Token expired, attempting to refresh...');
                    try {
                        const newToken = await refreshUserToken(usuario.refreshToken);
                        
                        const User = await import('../user/user.model.js').then(m => m.default);
                        await User.findByIdAndUpdate(usuario._id, { 
                            graphToken: newToken 
                        });
                        
                        console.log('Token refreshed successfully, retrying Teams meeting creation...');
                        
                        meetingLink = await createTeamsMeeting(
                            newToken,
                            `${tutorial.topic} - ${tutorial.subject.name}`,
                            startDateTime,
                            endDateTime
                        );
                        console.log('Teams meeting created with new token:', meetingLink);
                    } catch (refreshError) {
                        console.error('Error refreshing token:', refreshError.response?.data || refreshError.message);
                        console.log('Continuing without Teams meeting...');
                    }
                } else {
                    console.log('No refresh token available or different error, continuing without Teams meeting...');
                }
            }
        } else {
            console.log('No graph token available for user');
        }

        tutorial.status = "ACCEPTED";
        tutorial.actualDate = finalDate;
        tutorial.actualTime = finalDate.toLocaleTimeString();
        tutorial.duration = tutorialDuration;
        if (meetingLink) {
            tutorial.meetingLink = meetingLink;
        }
        tutorial.acceptedBy = usuario._id;
        tutorial.acceptedAt = new Date();

        await tutorial.save();

        return res.status(200).json({
            success: true,
            message: meetingLink 
                ? "Private tutorial accepted with Teams meeting created" 
                : "Private tutorial accepted (Teams meeting could not be created)",
            data: tutorial
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: "Error accepting private tutorial",
            error: error.message 
        });
    }
};

const refreshUserToken = async (refreshToken) => {
    try {
        const response = await axios.post(
            `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: process.env.AZURE_CLIENT_ID,
                client_secret: process.env.AZURE_CLIENT_SECRET,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                scope: 'openid profile email User.Read Files.ReadWrite OnlineMeetings.ReadWrite offline_access'
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        throw error;
    }
};

export const getTutorialByStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const tutorials = await privTutorial.find({ student: studentId })
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

export const getMyPrivTutorials = async (req, res) => {
    const usuario = req.usuario;

    try {
        const tutorials = await privTutorial.find({ student: usuario._id })
            .populate('tutor subject')
            .sort({ createdAt: -1 });

        if (!tutorials || tutorials.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No private tutorials found for this user'
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
            message: 'Error retrieving private tutorials for user'
        });
    }
}