import application from "./application.model.js";
import user from "../user/user.model.js";

export const requestToBeTutor = async (req, res) => {
    try {
        const { subject, description, evidence } = req.body;
        const {usuario} = req;
        if (subject || !description || !evidence) {
            return res.status(400).json({
                success: false,
                msg: "All fields are required"
            });
        }

        const applicationTutor = new application({applicantId: usuario._id, subject, description, 
        evidence, status: 'pending'});

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

export const updateApplicationStatus = async (req, res) => {
  try {
    const { aid } = req.params;
    const { status, responseMessage } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: 'Estado inválido. Usa "approved" o "rejected".'
      });
    }

    const updatedApplication = await application.findByIdAndUpdate(
      aid, { status, responseMessage: responseMessage || '' }, { new: true }
    );
    if (!application) {
      return res.status(404).json({
        success: false,
        msg: 'Application no encontrada'
      });
    }

    if (status === 'approved') {
      await user.findByIdAndUpdate(
        application.applicantId,
        { $addToSet: { subjects: application.subject } }
      );
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