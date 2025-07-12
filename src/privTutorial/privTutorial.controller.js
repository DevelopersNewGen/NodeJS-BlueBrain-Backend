import privTutorial from "./privTutorial.model.js";
import axios from "axios";
import qs from "qs";

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

const getZoomToken = async (req, res) => {
    const auth = Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString('base64');

    const { data } = await axios.post(
        `https://zoom.us/oauth/token`,
        qs.stringify({
        grant_type: 'account_credentials',
        account_id: process.env.ZOOM_ACCOUNT_ID,
        }),
        { headers: { Authorization: `Basic ${auth}` } }
    );

    return data.access_token;
}

export const createPrivTutorial = async (req, res) => {
    try {
        const { topic } = req.body;
        const { usuario } = req;
        const startISO = new Date().toISOString();

        const hostId = usuario.zoomAccount

        const zoomToken = await getZoomToken(req, res);

        const {data} =  await axios.post(
            `https://api.zoom.us/v2/users/${hostId}/meetings`,
            {
                topic,
                type: 2,           
                start_time: startISO,
                duration: 40,      
                settings: {
                    join_before_host: true,
                    approval_type: 2
                }
            },
            { headers: { Authorization: `Bearer ${zoomToken}` } }
        );

        return res.status(201).json({
            success: true,
            message: 'Private tutorial created successfully',
            link: data.join_url,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error creating private tutorial'
        });
        
    }
}