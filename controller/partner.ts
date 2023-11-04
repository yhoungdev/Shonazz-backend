const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Yup = require('yup');
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
        const createPartners = await prisma.partner.create({
          data: {
            ..._validate_body
          },
        });
    
        if (!createPartners) return res.status(500).json({ message: ' Something went wrong please try again' }); 
    
        return res.status(201).json({ message: 'Partneres details collected and saved successfully' });
      } catch (error) {
        //@ts-ignore
        return res.status(400).json({ error: 'Error inserting data into the database' , msg: error.message });
      }
  
}

export default partners_controller