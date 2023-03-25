import axios from 'axios'
import {db} from '../index.js'

export const getContact = async (req, res) => {
    const contactId = req.body?.contact_id;
    const dataStore = req.body?.data_store;
    
    if (!contactId || !dataStore) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try{
      let contact;
      if (dataStore === 'CRM') {
        contact = await getContactInCRM(contactId);
      } else if (dataStore === 'DATABASE') {
        contact = await getContactInDatabase(contactId);
      } else {
        return res.status(400).json({ message: 'Invalid data store' });
      }
  
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

    }catch(err){
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

}

async function getContactInCRM(contactId) {
  const DOMAIN=process.env.DOMAIN
  const API_KEY=process.env.API_KEY
  const url = `https://${DOMAIN}/contacts/${contactId}`;

  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token token=${API_KEY}`,
    },
  });

  return response.data.contact;
}

async function getContactInDatabase(contact_id) {
  const query = `SELECT * FROM contacts WHERE id=${contact_id}`;
  const result = await db.query(query);

  if (result && result.length > 0) {
    return result[0];
  }

  return null;
}


