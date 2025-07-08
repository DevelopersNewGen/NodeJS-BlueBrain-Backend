import Router from 'express';
import { requestToBeTutor, getAllApplications, updateApplicationStatus } from './application.controller.js';
import { peticionToBeTutorValidator, getAllApplicationsValidator, approveApplicationValidator } from '../middlewares/application-validator.js';  
import { upload } from '../middlewares/multer-uploads.js';

const router = Router();

router.post('/requestTutor', upload.single("evidence"), peticionToBeTutorValidator, requestToBeTutor);

router.get('/', getAllApplicationsValidator, getAllApplications);

router.patch('/approve/:aid', approveApplicationValidator, updateApplicationStatus);

export default router;