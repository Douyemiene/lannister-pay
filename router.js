//Modules
import express from 'express'
import { compute } from './controller.js';
import { validateComputeReq, handleBadComputeReqError } from './helpers.js'

const router = express.Router()

//Guest Routes
router.post('/split-payments/compute', validateComputeReq, compute)

router.use(handleBadComputeReqError);


export default router