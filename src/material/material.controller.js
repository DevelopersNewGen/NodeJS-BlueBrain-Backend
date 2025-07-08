import Material from './material.model.js';

export const createMaterial = async (req, res) => {
    try {
        const { title, description, subject, grade, type, fileUrl } = req.body;
        const uploaderId = req.usuario._id;

        const material = await Material.create({
            uploaderId,
            title,
            description,
            subject,
            grade,
            type,
            fileUrl
        });

        return res.status(201).json({
            success: true,
            message: "Material created successfully",
            material
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating material",
            error
        });
    }
};

export const getMaterials = async (req, res) => {
    try {
        const materials = await Material.find()
            .populate('uploaderId', 'name email')
            .populate('subject', 'name grade');
        return res.status(200).json({
            success: true,
            materials
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving materials",
            error
        });
    }
};

export const updateMaterial = async (req, res) => {
    try {
        const { mid } = req.params;
        const updateData = { ...req.body };
        const material = await Material.findByIdAndUpdate(mid, updateData, { new: true });
        if (!material) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Material updated successfully",
            material
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating material",
            error
        });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        const { mid } = req.params;
        const material = await Material.findByIdAndDelete(mid);
        if (!material) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Material deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting material",
            error
        });
    }
};