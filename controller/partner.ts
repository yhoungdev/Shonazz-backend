const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Yup = require('yup');
import { sendMail } from "../service/nodemailer";

import { Request , Response } from "express";
const partnerValidation = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    companyName: Yup.string().required(),
    businessType: Yup.string().required(),
    information: Yup.string()
  });

 const partners_controller = async  ( req: Request, res: Response ) => {
    try {
        const _validate_body = await partnerValidation.validate(req.body)
        const { email:userEmail , name } = _validate_body
        const createPartners = await prisma.partner.create({
          data: {
            ..._validate_body
          },
        });

        const subject: string = 'Thanks For The Partnership';
        const body = {
          username: name,
        };
        const email = userEmail
        const template = 'email_templates/partners';
        //@ts-ignore
        await sendMail({ email, subject, body, template });
    
        if (!createPartners) return res.status(500).json({ message: ' Something went wrong please try again' }); 
    
        return res.status(201).json({ message: 'Partneres details collected and saved successfully' });
      } catch (error) {
        //@ts-ignore
        return res.status(400).json({ error: 'Error inserting data into the database' , msg: error.message });
      }
  
}

export default partners_controller