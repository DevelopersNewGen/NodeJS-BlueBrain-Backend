import User from './user.model.js';
import Subject from '../subject/subject.model.js';
import Report from '../report/report.model.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('subjects', 'name');
        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving users',
            error
        });
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).populate('subjects', 'name');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving user',
            error
        });
    }
}

export const updateProfilePictureAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        let img = req.file ? req.file.path : null;
        let profilePicture = img ? img.replace(process.env.CLOUDINARY_BASE_URL, "") : null;

        if (profilePicture=== null || profilePicture === '') {
            profilePicture = 'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png';
        }

        const user = await User.findByIdAndUpdate(id, { profilePicture }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error
        });
    }
}

export const updateProfilePicture = async (req, res) => {
    const { usuario } = req;

    try {
        let img = req.file ? req.file.path : null;
        let profilePicture = img ? img.replace(process.env.CLOUDINARY_BASE_URL, "") : null;

        if (profilePicture=== null || profilePicture === '') {
            profilePicture = 'https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png';
        }

        console.log('Profile picture:', profilePicture);
        const user = await User.findByIdAndUpdate(usuario._id, { profilePicture }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating profile picture',
            error
        });
    }
}

export const getSubjectUsers = async (req, res) => {
    const { subjectId } = req.params;

    try {
        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        const users = await User.find({ subjects: subjectId })
            .select('name email profilePicture')
            .populate('subjects', 'name');

        return res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error retrieving users for subject',
            error
        });               
    }
}

export const reportUser = async (req, res) => {
    const { usuario } = req;
    const { reportTo, reason, relatedSubject, details } = req.body;

    try {
        const report = await Report.create({
            reportBy: usuario._id,
            reportTo,
            reason,
            relatedSubject,
            details
        });

        return res.status(201).json({
            success: true,
            message: 'User reported successfully',
            report
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error reporting user',
            error
        });
    }
}


