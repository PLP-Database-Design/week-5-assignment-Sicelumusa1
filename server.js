const express = require('express');
const app = express();
const mysql = require('mysql2');
const donenv = require('dotenv');

donenv.config();
  // Question 1
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// test db connection
db.connect((error) => {
  // failed  connection
  if(error) {
    return console.log("Error connecting to database: ", error);
  }

  console.log("Successfully connected to Mysql");
})

// Question 1
app.get('/patients', (req, res) => {
  const getPatients = `
  SELECT patient_id, first_name, last_name, date_of_birth 
  FROM patients
  `;

  db.query(getPatients, (error, data) => {
    
    // If error encountered
    if (error) {
      return res.status(400).send("Failed to get providers", error);
    }

    // On success
    res.status(200).send(data);
  });
});

  // Question 2
app.get('/providers', (req, res) => {
  const getProviders = `
    SELECT first_name, last_name, provider_specialty 
    FROM providers
  `;
  
  db.query(getProviders, (error, data) => {
    
    // If error encountered
    if (error) {
      return res.status(400).send("Failed to get patients", error);
    }

    // On success
    res.status(200).send(data);
  });
});

// Question 3
  app.get('/patients/name', (req, res) => {
    //  get the specialty from the request
    const firstName = req.query.firstName;

    // SQL query to filter providers by the given specialty
    const getPatientByName = `
      SELECT patient_id, first_name, last_name, date_of_birth
      FROM patients 
      WHERE first_name = ?
    `;

    // Execute the query with the parameter
    db.query(getPatientByName, [firstName], (error, data) => {
      
      // If error encountered
      if (error) {
        return res.status(400).send("Failed to get patient", error);
      }
  
      // if no providers found
      if (data.length === 0) {
        return res.status(404).send('No patients found with that name');
      }

      // On success, return the data
      res.status(200).send(data);
    });
  });

  // Question 4
  app.get('/providers/specialty', (req, res) => {
    //  get the specialty from the request
    const specialty = req.query.specialty;

    // SQL query to filter providers by the given specialty
    const getProvidersBySpecialty = `
      SELECT first_name, last_name, provider_specialty 
      FROM providers 
      WHERE provider_specialty = ?
    `;

    // Execute the query with the parameter
    db.query(getProvidersBySpecialty, [specialty], (error, data) => {
      
      // If error encountered
      if (error) {
        return res.status(400).send("Failed to get providers", error);
      }
  
      // if no providers found
      if (data.length === 0) {
        return res.status(404).send('No providers found with the specified specialty');
      }

      // On success, return the data
      res.status(200).send(data);
    });
  });
   

   // listen to the server
   const PORT = process.env.PORT
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   })