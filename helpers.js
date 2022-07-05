import joi from "joi";
import { createValidator } from 'express-joi-validation'


const validator = createValidator({
    passError: true,
});


export const validateComputeReq = validator.body(
    joi.object({
        ID: joi.number().required(),
        Amount: joi.number().required(),
        Currency: joi.string().required(),
        CustomerEmail: joi.string().required(),
        SplitInfo: joi.array().items(
            joi.object({
                SplitType: joi.string().required(),
                SplitValue: joi.number().required(),
                SplitEntityId: joi.string().required(),
            }).required()
        ),
    })
);

export const handleBadComputeReqError = (
    err,
    req,
    res,
    next
) => {
    if (err) {
        const { error } = err;
        let msg = "";
        if (error) {
            error.details.forEach((err, idx) => {
                let formattedMsg = err.message;
                if (idx == error.details.length - 1 && idx != 0) {
                    msg += ` and ${formattedMsg}`;
                } else {
                    msg += `${formattedMsg},`;
                }
            });
        }

        res.status(400).json({
            success: false,
            error: `bad request ${err.type}`,
            msg,
        });
    } else {
        res.status(500).end("internal server error");
    }
};