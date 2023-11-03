const express = require('express');
const partnerValidation = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    companyName: Yup.string().required(),
    businessType: Yup.string().required(),
    information: Yup.string()
  });

export const partners_controller = async  ( req , res ) => {
    try {
        const _validate_body = await contactValidator.validate(req.body)
        const contact = await prisma.partner.create({
          data: {
            ..._validate_body
          },
        });
    
        if (!contact) return res.status(500).json({ message: ' Something went wrong please try again' }); 
    
        return res.status(201).json({ message: 'Partneres details collected and saved successfully' });
      } catch (error) {
        return res.status(400).json({ error: 'Error inserting data into the database' , msg: error.message });
      }
}