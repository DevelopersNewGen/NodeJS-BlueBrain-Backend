import Subject from './subject.model.js';

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teachers', 'name email profilePicture');
        return res.status(200).json({ 
            success: true, 
            message: 'Subjects retrieved successfully', 
            data: subjects 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error retrieving subjects' 
        });
    }
}

export const getSubjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await Subject.findById(id).populate('teachers', 'name email profilePicture');
        if (!subject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Subject retrieved successfully', 
            data: subject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error retrieving subject' 
        });
    }
}

export const createSubject = async (req, res) => {
    const { name, code, grade, description } = req.body;
    try {
        const newSubject = new Subject({ name, code, grade, description });
        await newSubject.save();
        return res.status(201).json({ 
            success: true, 
            message: 'Subject created successfully', 
            data: newSubject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error creating subject' 
        });
    }
}

export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { name, code, grade, description } = req.body;
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(id, { name, code, grade, description }, { new: true });
        if (!updatedSubject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Subject updated successfully', 
            data: updatedSubject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error updating subject' 
        });
    }
}

export const deleteSubject = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Subject deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error deleting subject' 
        });
    }
}

export const addTeacherToSubject = async (req, res) => {
    const { id } = req.params;
    const { teacherId } = req.body;
    try {
        const subject = await Subject.findById(id);
        if (!subject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        if (subject.teachers.includes(teacherId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Teacher already assigned to this subject' 
            });
        }
        subject.teachers.push(teacherId);
        await subject.save();
        return res.status(200).json({ 
            success: true, 
            message: 'Teacher added to subject successfully', 
            data: subject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error adding teacher to subject' 
        });
    }
}