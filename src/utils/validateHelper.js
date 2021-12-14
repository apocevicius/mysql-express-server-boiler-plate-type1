const joi = require('joi');

async function validateRegister(req, res, next) {
  console.log('body got to validate:', req.body);
  // validate body using joi
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    console.warn(error);
    res.status(400).send({
      error: error.details.map((e) => ({
        errorMsg: e.message,
        field: e.context.key,
      })),
    });
    return false;
  }
}

async function validateNewPost(req, res, next) {}

/* 
{
  "title": string, at least 4 letters, required
  "body": sting, min 10 letters, required
  "userId": number,  posible values (1, 2, 3)
}
*/

module.exports = {
  validateRegister,
};
