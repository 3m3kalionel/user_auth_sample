const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

export const isEmpty = fieldValue => {
  return !(fieldValue.trim().length === 0);
}

export const handleError = ({ errors }, res) => {
  const modelErrors = Object.keys(errors);

  return res.status(400).send({
    status: 'failed',
    message: errors[modelErrors.shift()].message,
  });
}
