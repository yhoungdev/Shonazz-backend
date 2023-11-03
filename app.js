const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');
const Yup = require('yup');



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


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

app.get('/' , (req, res ) => {
  res.status(200).json({message: "welcome to shonaz api"})
})

app.post('/contact', async (req, res) => {
  // const { name, email, phoneNumber, companyName, services, message } = req.body;

  try {
    const _validate_body = await contactValidator.validate(req.body)
    const contact = await prisma.contact.create({
      data: {
        ..._validate_body
      },
    });

    if (!contact) return res.status(500).json({ message: 'There was issue regestering data' }); 

    return res.status(201).json({ message: 'Contact details collected and saved successfully' });
  } catch (error) {
    return res.status(400).json({ error: 'Error inserting data into the database' , msg: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
