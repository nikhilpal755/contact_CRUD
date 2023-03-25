import axios from 'axios'
import {db} from '../index.js'
import dotenv from 'dotenv'

dotenv.config();
export const deleteContact = async (req, res) => {
    const contact_id = req.body.contact_id;
    const data_store = req.body.data_store;
  
    try {
      let result;   
      if (data_store === 'CRM') {
        result = await deleteContactFromCRM(contact_id);
      } else if (data_store === 'DATABASE') {
        result = await deleteContactFromDatabase(contact_id);
      } else {
        throw new Error('Invalid data_store value. Must be "CRM" or "DATABASE"');
      }
  
      res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
}


// Function to delete a contact from Freshsales CRM
async function deleteContactFromCRM(contactId) {
  
  const DOMAIN=process.env.DOMAIN
  const API_KEY=process.env.API_KEY
  try {
    const response = await axios.delete(`https://${DOMAIN}/contacts/${contactId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token token=${API_KEY}`,
      },
    });


    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
  // Function to delete a contact from the database
async function deleteContactFromDatabase(contact_id) {
    const sql = `DELETE FROM contacts WHERE id = ${contact_id}`;
    const result = await db.query(sql);
    if (result.affectedRows === 0) {
      throw new Error(`Contact with ID ${contact_id} not found in database`);
    }
    return true;
  }