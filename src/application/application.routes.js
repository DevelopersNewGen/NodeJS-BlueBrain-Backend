import Router from 'express';
import { requestToBeTutor, getAllApplications, updateApplicationStatus } from './application.controller.js';
import { peticionToBeTutorValidator, getAllApplicationsValidator, approveApplicationValidator } from '../middlewares/application-validator.js';  

const router = Router();

router.post('/requestTutor', peticionToBeTutorValidator, requestToBeTutor);

router.get('/', getAllApplicationsValidator, getAllApplications);

router.patch('/approve/:aid', approveApplicationValidator, updateApplicationStatus);

export default router;