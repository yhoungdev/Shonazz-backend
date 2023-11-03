import * as Yup from 'yup';

const contactValidator = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().required(),
  companyName: Yup.string().required(),
  services: Yup.string().required(),
  message: Yup.string().required(),
});

module.exports = {contactValidator}
