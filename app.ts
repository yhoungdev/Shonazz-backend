const express = require('express');
import { PrismaClient } from '@prisma/client';
import cors from 'cors'
import * as Yup from 'yup'
import { Response , Request } from "express";
import { sendMail } from "./service/nodemailer";
import partners_controller from "./controller/partner";

// Use partnersController as needed


const app = express();
const prisma = new PrismaClient();

const contactValidator = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().required(),
  companyName: Yup.string().required(),
  services: Yup.string().required(),
  message: Yup.string()
});

app.use(express.json())
app.use(cors());

app.get('/' , async (req: Request, res: Response ) => {
  res.status(200).json({message: "welcome to shonaz api"})
})

app.post('/partner' , partners_controller)

app.post('/contact', async (req: Request, res: Response) => {
  // const { name, email, phoneNumber, companyName, services, message } = req.body;

  try {
    const _validate_body = await contactValidator.validate(req.body);
    const {email: userEmail, name } = _validate_body
    const contact = await prisma.contact.create({
      data: {
        ..._validate_body
      },
    });

    if (!contact) return res.status(500).json({ message: 'There was issue regestering data' }); 

    const subject: string = 'Thanks for Contacting Us!';
    const body = {
      username: name,
    };
    const email = userEmail
    const template = 'email_templates/welcome';
    //@ts-ignore
    await sendMail({ email, subject, body, template });

    return res.status(201).json({ message: 'Contact details collected and saved successfully' });
  } catch (error) {
    //@ts-ignore
    return res.status(400).json({ error: 'Error inserting data into the database' , msg: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
