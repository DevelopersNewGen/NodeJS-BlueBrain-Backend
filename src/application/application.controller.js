import application from "./application.model.js";
import user from "../user/user.model.js";
import Subject from "../subject/subject.model.js";

export const requestToBeTutor = async (req, res) => {
	try {
		let img = req.file;

		const { subject, description } = req.body;
		const { usuario } = req;

		const evidenceUrl = img ? img.path : null;

		if (!subject || !description || !req.file) {
			return res.status(400).json({
				success: false,
				msg: "All fields are required"
			});
		}
		
		const applicationTutor = new application({
			applicantId: usuario._id,
			subject,
			description,
			evidence: evidenceUrl,
			status: 'pending'
		});

		await applicationTutor.save();

		res.status(201).json({
			success: true,
			msg: "Application submitted successfully",
			applicationTutor
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "An error occurred while submitting the application",
			error: error.message
		});
	}
}

export const getAllApplications = async (req, res) => {
  try {
		const applications = await application.find()
			.populate('applicantId', 'name email')   
			.populate('subject', 'grade description')
			.sort({ requestHour: -1 });

		return res.status(200).json({
			success: true,
			applications
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: 'Error al obtener las solicitudes',
			error: error.message
		});
	}
};

export const getApplicationsByUser = async (req, res) => {
	try {
		const { uid } = req.params;
		const applications = await application.find({ applicantId: uid })
			.populate('applicantId', 'name email')
			.populate('subject', 'grade description')
			.sort({ requestHour: -1 });

		if (applications.length === 0) {
			return res.status(404).json({
				success: false,
				msg: 'No applications found for this user'
			});
		}

		return res.status(200).json({
			success: true,
			applications
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: 'Error retrieving applications for user',
			error: error.message
		});
	}
}

export const getApplicationsBySubject = async (req, res) => {
	try {
		const { sid } = req.params;
		const applications = await application.find({ subject: sid })
			.populate('applicantId', 'name email')
			.populate('subject', 'grade description')
			.sort({ requestHour: -1 });

		if (applications.length === 0) {
			return res.status(404).json({
				success: false,
				msg: 'No applications found for this subject'
			});
		}

		return res.status(200).json({
			success: true,
			applications
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: 'Error retrieving applications for subject',
			error: error.message
		});
	}
}


export const getApplicationById = async (req, res) => {
	try {
		const { aid } = req.params;
		const app = await application.findById(aid)
			.populate('applicantId', 'name email')
			.populate('subject', 'grade description teachers');
		
		if (!app) {
			return res.status(404).json({
				success: false,
				msg: 'Application not found'
			});
		}
		
		return res.status(200).json({
			success: true,
			application: app
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: 'Error retrieving application',
			error: error.message
		});
	}
}

export const updateApplicationStatus = async (req, res) => {
	try {
		const { aid } = req.params;
		const { status, responseMessage } = req.body;
		const usuario = req.usuario; 

		if (!['approved', 'rejected'].includes(status)) {
			return res.status(400).json({
				success: false,
				msg: 'Estado inválido. Usa "approved" o "rejected".'
			});
		}
    const app = await application.findById(aid).populate('subject', 'teachers');

    if(!app.subject.teachers.includes(usuario._id)) {
      return res.status(403).json({
        success: false,
        msg: 'No tienes permiso para actualizar esta solicitud'
      });
    }

		const updatedApplication = await application.findByIdAndUpdate(
			aid, 
			{ status, responseMessage: responseMessage || '' }, 
			{ new: true }
		);

		if (status === 'approved') {
			await user.findByIdAndUpdate(
				updatedApplication.applicantId,
				{ $addToSet: { subjects: updatedApplication.subject },  role: "TUTOR_ROLE" }
			);
			await Subject.findByIdAndUpdate( app.subject._id, 
				{ $addToSet: { tutors: updatedApplication.applicantId } },
			{ new: true });
		}

		return res.status(200).json({
			success: true,
			msg: `Application ${status === 'approved' ? 'aprobada' : 'rechazada'} correctamente`,
			updatedApplication
		});

	} catch (error) {
		return res.status(500).json({
			success: false,
			msg: 'Error interno al procesar la solicitud',
			error: error.message
		});
	}
};