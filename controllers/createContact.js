import axios from "axios";
import { db } from '../index.js'
import dotenv from 'dotenv'
dotenv.config();


export const createContact = async (req, res) => {
  const dataStore = req.body.data_store;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const email = req.body.email;
  const mobileNumber = req.body.mobile_number;

  try {

    let contact;
    if (dataStore === 'CRM') {
      contact = await createContactInCRM(firstName, lastName, email, mobileNumber)


    } else if (dataStore === 'DATABASE') {
      contact = await createContactInDatabase(firstName, lastName, email, mobileNumber)
    } else {
      res.status(400).json({ message: 'Invalid data store' });
    }
    res.status(200).json({ message: 'Contact created', contact: contact });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }

}


async function createContactInCRM(first_name, last_name, email, mobile_number) {
  const DOMAIN = process.env.DOMAIN
  const API_KEY = process.env.API_KEY

  const contact = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    mobile_number: mobile_number
  }

  let res;
  try {
    const response = axios.post(`https://${DOMAIN}/contacts`, contact,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token token=${API_KEY}`,
        }
      }).then((resp) => {
        console.log(resp?.data);
        res = resp?.data;
      })
     return res;

  } catch (error) {
    console.error(error);
    throw new Error('Error creating contact in Freshsales CRM');
  }
}

function createContactInDatabase(first_name, last_name, email, mobile_number) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES ('${first_name}', '${last_name}', '${email}', '${mobile_number}')`;

    db.query(query, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result)
      }
    });
  });
}