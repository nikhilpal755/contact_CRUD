import express from 'express'
import { dbConnection } from './middleware/db.js';
import morgan from 'morgan';
import cors from 'cors'
import { createContact } from './controllers/createContact.js';
import { getContact } from './controllers/getContact.js';
import { updateContact } from './controllers/updateContact.js';
import { deleteContact } from './controllers/deleteContact.js';

const app = express();
const port = 5000;

// database connection
export const db = dbConnection();
// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(cors());

// routes
app.post('/createContact', createContact);
app.post('/getContact', getContact);
app.post('/updateContact', updateContact);
app.post('/deleteContact', deleteContact);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})