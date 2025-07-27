import Router from 'express';
import { requestToBeTutor, getAllApplications, getApplicationsByUser, getApplicationsBySubject, getApplicationById, 
    updateApplicationStatus } from './application.controller.js';
import { peticionToBeTutorValidator, getAllApplicationsValidator, getApplicationsByUserValidator, getApplicationsBySubjectValidator, getApplicationByIdValidator,
    approveApplicationValidator } from '../middlewares/application-validator.js';
import { uploadEvidence } from '../middlewares/cloudinary-uploader.js';

const router = Router();

router.post('/requestTutor', uploadEvidence.single("evidence"), peticionToBeTutorValidator, requestToBeTutor);

router.get('/', getAllApplicationsValidator, getAllApplications);

router.get('/user/:uid', getApplicationsByUserValidator, getApplicationsByUser);

router.get('/subject/:sid', getApplicationsBySubjectValidator, getApplicationsBySubject);

router.get('/:aid', getApplicationByIdValidator, getApplicationById);

router.patch('/approve/:aid', approveApplicationValidator, updateApplicationStatus);

export default router;