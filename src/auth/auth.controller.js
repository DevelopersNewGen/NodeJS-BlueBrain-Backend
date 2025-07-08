import User from "../user/user.model.js";
import axios from "axios";
import { generateJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const url = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize` +
        `?client_id=${process.env.AZURE_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(process.env.AZURE_REDIRECT_URI)}` +
        `&response_mode=query` +
        `&scope=openid profile email User.Read Files.ReadWrite offline_access`;

    res.redirect(url);
};

export const authCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const tokenResponse = await axios.post(
            `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: process.env.AZURE_CLIENT_ID,
                scope: 'openid profile email User.Read Files.ReadWrite offline_access',
                code,
                redirect_uri: process.env.AZURE_REDIRECT_URI,
                grant_type: 'authorization_code',
                client_secret: process.env.AZURE_CLIENT_SECRET,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        const user = userResponse.data;

        let dbUser = await User.findOne({ azureId: user.id });
        if (!dbUser) {
            dbUser = new User({
                azureId: user.id,
                graphToken: accessToken,
                name: user.givenName + ' ' + user.surname,
                username: user.displayName,
                email: user.mail || user.userPrincipalName,
                role: 'STUDENT_ROLE',
                subjects: []
            });
            await dbUser.save();
        } else {
            dbUser.graphToken = accessToken;
            await dbUser.save();
        }

        const webToken = await generateJWT(dbUser._id);

        return res.status(200).json({
            success: true,
            message: 'Authentication successful',
            userDetails: {
                email: dbUser.email,
                name: dbUser.name,
                img: null,
                token: webToken
            }
        });

    } catch (error) {
        console.error('Error in authCallback:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.response?.data || error.message
        });
    }
};

