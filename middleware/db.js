import mysql from 'mysql'
export const dbConnection = () =>{
    const db = mysql.createConnection({
        host: 'localhost',  
        user: 'root',
        password: '',
        database: 'contacts'
    })
    db.connect((err) => {
        if (err) {
          console.error('Database connection failed: ' + err.stack);
          return;
        }
        console.log('Connected to database.');
    });
    return db;    
}