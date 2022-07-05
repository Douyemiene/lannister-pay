//Modules
import express from 'express'
import { validateComputeReq, sendBadRequestErrorResponse } from './helpers.js'

const router = express.Router()

//Guest Routes
router.post('/split-payments/compute', validateComputeReq, compute)

router.use(sendBadRequestErrorResponse);


export default router