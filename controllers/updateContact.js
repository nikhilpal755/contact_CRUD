import axios from 'axios'
import {db} from '../index.js'
import dotenv from 'dotenv'
dotenv.config();

export const updateContact = async (req, res) => {
    const contactId = req.body.contact_id;
    const newEmail = req.body.new_email;
    const newMobileNumber = req.body.new_mobile_number;
    const dataStore = req.body.data_store;
  
    // Check if data store is CRM or DATABASE
    if (dataStore === 'CRM') {
      updateContactInCRM(contactId, newEmail, newMobileNumber)
      .then(() => {
        res.status(200).json({
          message: `Contact with ID ${contactId} updated in CRM`,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err });
      });
    } else if (dataStore === 'DATABASE') {
      // Update contact in MySQL database
      const query = `UPDATE contacts SET email = '${newEmail}', mobile_number = '${newMobileNumber}' WHERE id = ${contactId}`;
  
      db.query(query, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error updating contact in database');
        } else if (result.affectedRows === 0) {
          res.status(404).send(`Contact with ID ${contactId} not found`);
        } else {
          res.send(`Contact with ID ${contactId} updated in database`);
        }
      });
    } else {
      res.status(400).send('Invalid data store specified');
    }
}

// Update contact in Freshsales CRM
function updateContactInCRM(contactId, newEmail, newMobileNumber) {
  const DOMAIN=process.env.DOMAIN
  const API_KEY=process.env.API_KEY

  const axiosConfig = {
    headers: {
      Authorization: `Token token=${API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  const updateData = {
    contact: {
      email: newEmail,
      mobile_number: newMobileNumber,
    },
  };

  return axios.put(
    `https://${DOMAIN}/contacts/${contactId}`,
    updateData,
    axiosConfig
  );
}
