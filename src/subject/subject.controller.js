import User from '../user/user.model.js';
import Subject from './subject.model.js';

export const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find()
            .populate('teachers', 'name email profilePicture')
            .populate('tutors', 'name email profilePicture')
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
    const { sid } = req.params;
    try {
        const subject = await Subject.findById(sid)
            .populate('teachers', 'name email profilePicture')
            .populate('tutors', 'name email profilePicture');
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
        let img = req.file ? req.file.path : null;

        req.body.img = img ? img.replace(process.env.CLOUDINARY_BASE_URL, "") : null;

        const newSubject = new Subject({ img, name, code, grade, description });
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
    const { sid } = req.params;
    const { name, code, grade, description } = req.body;
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(sid, { name: name, code: code, grade: grade, description: description }, { new: true });
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
    const { sid } = req.params;
    try {
        const deletedSubject = await Subject.findByIdAndDelete(sid);
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
    const { sid } = req.params;
    const { teacherId } = req.body;
    try {
        const subject = await Subject.findById(sid);
        const teacherExists = await User.findById(teacherId);

        if (!teacherExists) {
            return res.status(404).json({ 
                success: false, 
                message: 'Teacher not found' 
            });
        }

        if(teacherExists.role !== 'TEACHER_ROLE') {
            teacherExists.role = 'TEACHER_ROLE';
            await teacherExists.save();
        }

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

export const removeTeacherFromSubject = async (req, res) => {
    const { sid } = req.params;
    const { teacherId } = req.body;
    try {
        const subject = await Subject.findById(sid);
        if (!subject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        if (!subject.teachers.includes(teacherId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Teacher not assigned to this subject' 
            });
        }
        subject.teachers = subject.teachers.filter(id => id.toString() !== teacherId);
        await subject.save();
        return res.status(200).json({ 
            success: true, 
            message: 'Teacher removed from subject successfully', 
            data: subject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error removing teacher from subject' 
        });
    }
}

export const removeTutorFromSubject = async (req, res) => {
    const { sid } = req.params;
    const { tutorId } = req.body;
    try {
        const subject = await Subject.findById(sid);
        if (!subject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Subject not found' 
            });
        }
        if (!subject.tutors || !subject.tutors.includes(tutorId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tutor not assigned to this subject' 
            });
        }

        subject.tutors = subject.tutors.filter(id => id.toString() !== tutorId);
        await subject.save();

        await User.findByIdAndUpdate( tutorId, { $pull: { subjects: sid } }, { new: true });

        return res.status(200).json({ 
            success: true, 
            message: 'Tutor removed from subject successfully', 
            data: subject 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error removing tutor from subject' 
        });
    }
}