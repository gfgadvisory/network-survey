const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { Resend } = require('resend');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');

// Create a new instance of the Pool
const pool = new Pool({
  user: 'postgres',
  password: 'Picker22',
  host: 'database-1.co6wn5j0nqtw.us-east-2.rds.amazonaws.com',
  port: '5432',
  database: '',
});
const resend = new Resend('re_UNs8VgH6_HhcK6GEjQM7pk3BczHt9dKB3');

const EMAIL_HTML = [`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<html lang="en">

  <head data-id="__react-email-head"></head>
  <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">You&#x27;re now ready to take your CLA survey!
  </div>

  <body data-id="__react-email-body" style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
    <table align="center" width="100%" data-id="__react-email-container" role="presentation" cellSpacing="0" cellPadding="0" border="0" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" data-id="react-email-section" style="padding:0 48px" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr>
                  <td><img data-id="react-email-img" alt="Logo" src="https://i.postimg.cc/4nkbg08K/logo.png" width="189" height="49" style="display:block;outline:none;border:none;text-decoration:none" />
                    <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />`, 
                    `<a href="`, `" data-id="react-email-button" target="_blank" style="background-color:#42B4AF;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;width:100%;line-height:100%;max-width:100%;padding:10px 10px"><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Start your survey</span><span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                    <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                    <p data-id="react-email-text" style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">View our <a href="https://stripe.com/docs" data-id="react-email-link" target="_blank" style="color:#556cd6;text-decoration:none">privacy policy</a> .</p>
                    <p data-id="react-email-text" style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel rhoncus lacus. Nulla facilisi. Donec turpis sem, dictum a sollicitudin a, faucibus ac sem. Morbi sed erat non ex mollis pulvinar ut eu nisi.</p>
                    <p data-id="react-email-text" style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">— The CLA team</p>
                    <hr data-id="react-email-hr" style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0" />
                    <p data-id="react-email-text" style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">Contemporary Leadership Advisors, 299 Park Ave, New York, NY 10171</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`];

const loremIpsum = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vel rhoncus lacus. Nulla facilisi. Donec turpis sem, dictum a sollicitudin a, faucibus ac sem.</p> 
<p>Morbi sed erat non ex mollis pulvinar ut eu nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida cursus pellentesque. Aliquam in lectus et ex ultricies sodales a.</p>`; 

async function sendMail(email, id, surveyName, text = loremIpsum, html = EMAIL_HTML) {
  try {
    text = text.replace(/<p>/g, '<p data-id="react-email-text" style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">');

    let customLink = `http://localhost:3002/?surveyName=${surveyName}&userId=${id}`;
    const data = await resend.emails.send({
      from: 'CLA Survey <survey@cladvisors.com>',
      to: email,
      subject: 'CLA Network Survey',
      html: html[0] + text + html[1] + customLink + html[2]
    });
  } catch (error) {
    console.error(error);
  }
}

// sendMail('bgarcia2324@gmail.com', 'byVHldRI2ZgaOXNhE-ih7', 'GEEEEEE');

// Function to execute a query
async function executeQuery(query) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(query);
    return result;
  } finally {
    client.release();
  }
}

const app = express();
const port = 3000; // Choose your desired port number

// TODO for MVP
// - move to a database to store survey data
// - extend the create survey backend
// -- handle json file upload
// -- handle xlsx entry
// - add authentication
// - add email functionality
// - add csv file download

app.use(cors()); // Enable CORS



// Example usage: Adding a new survey
async function insertSurvey(name, title) {
  const query = `INSERT INTO Survey (name, title, creation_date)
                 VALUES ('${name}', '${title}', NOW())`;
  const result = await executeQuery(query);
  
  // Handle the result as needed
  console.log('Survey added successfully!');
}
async function insertUsers(users) {
  // Start a PostgreSQL client from the pool
  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Iterate through the users and insert them
    for (const user of users) {
      const query = 'INSERT INTO Respondent (name, contact_info, uuid, survey_name, can_respond) VALUES ($1, $2, $3, $4, $5)';
      const values = [user.userName, user.email, user.userId, user.surveyName, user.respondent];
      await client.query(query, values);
    }

    // Commit the transaction
    await client.query('COMMIT');

    // Release the client back to the pool
    client.release();

    console.log('Users inserted successfully!');
  } catch (error) {
    // If an error occurs, rollback the transaction
    console.log(error)
    await client.query('ROLLBACK');
    console.error('Error inserting users:', error);
    client.release();
  }
}
async function insertQuestions(name, title, json) {
  const client = await pool.connect();

  try {
    const query = 'UPDATE Survey SET title = $1, questions = $2 WHERE name = $3';
    const values = [title, json, name];

    await client.query(query, values);

    console.log('Survey modified successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.end();
  }
}
async function insertResponses(responses, userId) {
  const client = await pool.connect();

  try {
    const query = 'UPDATE Respondent SET response = $1 WHERE uuid = $2';
    const values = [responses, userId];

    await client.query(query, values);

    console.log('Survey modified successfully!');
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.end();
  }  
}

// PUT API endpoint for creating a new survey
app.post('/api/survey', express.json(), (req, res) => {
  const data  = req.body;
  const surveyName = data.surveyName;

  if (!surveyName) {
    res.status(400).json({ message: 'Survey name is required.' });
    return;
  }

  // Call the function to add a new survey
  insertSurvey(surveyName, '')
  .catch(error => console.error(error));
});

// PUT API endpoint for uploading a csv file of names
app.post('/api/updateTargets', express.json(), (req, res) => {
  const data  = req.body;
  const csvData = data.csvData;
  const surveyName = data.surveyName;


  if (!surveyName) {
    res.status(400).json({ message: 'Survey name is required.' });
    return;
  }
  if (!csvData) {
    res.status(400).json({ message: 'CSV data is required.' });
    return;
  }
  let csvArray = csvData.split('\n');
  const header = csvArray.shift().split(',');
  const headerDict = {};

  header.forEach((name, index) => {
    headerDict[name.replace(/(\r\n|\n|\r)/gm, "")] = index;
  });
  console.log(headerDict);
  // Convert to json
  const surveyTargets = csvArray.map((row, index) => {
    const columns = row.split(',');
    return {
      userName: columns[headerDict['First']].replace(/(\r\n|\n|\r)/gm, "") + " " + columns[headerDict['Last']].replace(/(\r\n|\n|\r)/gm, ""),
      firstName: columns[headerDict['First']].replace(/(\r\n|\n|\r)/gm, ""),
      lastName: columns[headerDict['Last']].replace(/(\r\n|\n|\r)/gm, ""),
      email: columns[headerDict['Email']].replace(/(\r\n|\n|\r)/gm, ""),
      respondent: columns[headerDict['Respondent']].replace(/(\r\n|\n|\r)/gm, ""),
      location: columns[headerDict['Location']].replace(/(\r\n|\n|\r)/gm, ""),
      level: columns[headerDict['Level']].replace(/(\r\n|\n|\r)/gm, ""),
      gender: columns[headerDict['Gender']].replace(/(\r\n|\n|\r)/gm, ""),
      race: columns[headerDict['Race']].replace(/(\r\n|\n|\r)/gm, ""),
      manager: columns[headerDict['Manager']].replace(/(\r\n|\n|\r)/gm, ""),
      vp:columns[headerDict['VP']].replace(/(\r\n|\n|\r)/gm, ""),
      businessGroup:columns[headerDict['Business Group']].replace(/(\r\n|\n|\r)/gm, ""),
      businessGroup1:columns[headerDict['Business Group - 1']].replace(/(\r\n|\n|\r)/gm, ""),
      businessGroup2:columns[headerDict['Business Group - 2']].replace(/(\r\n|\n|\r)/gm, ""),
      userId: nanoid(),
      surveyName: surveyName,
      answers: []
    }
  });
  // NEW DB CODE
  // Insert the users into the database
  insertUsers(surveyTargets);

  // OLD FS CODE
  let error = false;

  // Write the user data to the file
  const surveyUserDataFile = `data/userdata_${surveyName}.json`;
  fs.writeFile(surveyUserDataFile, JSON.stringify(surveyTargets, null, 2), err => 
  {  
    if (err){
      console.error('Error writing user data file:', err); 
      error = true;
    }
  });

  // generate names file from surveyTargets
  const surveyNamesFile = `data/names_${surveyName}.json`;

  // Create an array of names from the surveyTargets
  const names = [];
  surveyTargets.forEach((user, index) => {
    names.push(user.userName + " (" + user.email + ")");
  });
  // Write the names to the file
  fs.writeFile(surveyNamesFile, JSON.stringify(names, null, 2), err =>
  {
    if (err){
      console.error('Error reading name data file:', err);
      error = true;
    }
  });

  if (error) {
    res.status(500).json({ message: 'Error creating survey.' });
  } else {
    res.json({ message: 'Survey created successfully.' });
  }
});

// PUT API endpoint for uploading a json file of questions
app.post('/api/updateQuestions', express.json(), (req, res) => {
  const data  = req.body;
  const surveyQuestions = data.surveyQuestions;
  const surveyName = data.surveyName;
  // move to another endpoint
  const surveyTitle = data.surveyTitle;

  console.log("DATA:", data);
  // NEW DB CODE
  insertQuestions(surveyName, surveyTitle, surveyQuestions);


});

// PUT API endpoint for answer submission
app.post('/api/user', express.json(), (req, res) => {
    const data  = req.body;
    console.log(data);
    const userId  = data.userId;
    const surveyName = data.surveyName;
    const answers = JSON.parse(data.answers);
    const answerTimeStamp = new Date().toLocaleString();
    // add time stamp to answers
    answers.timeStamp = answerTimeStamp; 

    // NEW DB CODE
    insertResponses(answers, userId);

});

// GET API endpoint for lazy loading the names list
app.get('/api/names', async (req, res) => {
  const { skip = 0, take = 10, filter = '', surveyName = '' } = req.query;

  console.log("skip:", skip, "take:", take, "filter:", filter, "surveyName:", surveyName);
  // NEW DB CODE
    
  const client = await pool.connect();
  
  const query = `
  SELECT r.name, r.contact_info
  FROM Respondent r
  JOIN Survey s ON r.survey_name = s.name
  WHERE s.name = $1
  AND (r.name ILIKE $2 OR r.contact_info ILIKE $2)
  OFFSET $3
  LIMIT $4;
  `;

  const values = [surveyName, `%${filter}%`, skip, take];
  client.query(query, values)
  .then(result => {
    const users = result.rows;
    // Process the returned users
    filteredNames = [];
    // iterate over name, contact_info pairs
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      // add to response
      filteredNames.push(user.name + " (" + user.contact_info + ")");
    }
    const response = {
      names: filteredNames,
      //TODO check that this length/total even works
      total: filteredNames.length
    };
    console.log("RESPONSE:", response);
    res.json(response);
  })
  .catch(error => {
    // Handle the error
    console.error(error);
  });
  client.release();
  
});

// GET API endpoint for survey questions
app.get('/api/questions', async (req, res) => {
  const { surveyName = '' } = req.query;

  if(surveyName === '' || surveyName === 'undefined' || surveyName === null || surveyName === 'null') {
    res.status(404).json({ message: 'Survey name not found.' });
    return;
  }

  // NEW DB CODE
  const client = await pool.connect();

  const query = `
  SELECT questions, title
  FROM Survey
  WHERE name = $1;
  `;

  const values = [surveyName];

  client.query(query, values)
    .then(result => {
      const jsonData = {title: result.rows[0].title, questions: result.rows[0].questions};
      // Process the returned JSON data
      res.json(jsonData);
    })
    .catch(error => {
      // Handle the error
      console.error(error);
    })
    .finally(() => client.release());

  });

// GET API endpoint for survey results
app.get('/api/results', async (req, res) => {
  const { surveyName = '' } = req.query;
  

  // NEW DB CODE
  const client = await pool.connect();
  
  const query = 'SELECT name, response FROM Respondent WHERE survey_name = $1';
  const values = [surveyName];
  client.query(query, values)
    .then(response => {
        const responses = response.rows.reduce((combined, row) => {
          if (row.response === null) return combined;
          return {...combined, [row.name]: row.response};
        }, {});
        console.log(responses); // This will be an array of response JSON objects
        res.json({responses});
    })
    .catch(e => console.error(e.stack))
    .finally(() => client.end());

});

// GET API endpoint for a list of survey targets and the status of their responses
app.get('/api/targets', async(req, res) => {
  const { surveyName = '' } = req.query;
  console.log("Survey name: " + surveyName)

  // NEW DB CODE
  const client = await pool.connect();

  const query = `SELECT name, contact_info, response IS NULL AS response_status 
               FROM Respondent 
               WHERE survey_name = $1`;
  client.query(query, [surveyName])
    .then(response => {
        const respondents = response.rows.map(row => ({
            userName: row.name,
            Email: row.contact_info,
            status: row.response_status ? 'Incomplete' : 'Complete'
        }));
        res.json(respondents); // This will be an array of respondent objects
    })
    .catch(e => console.error(e.stack))
    .finally(() => client.end());
});

// GET API endpoint for a list of current surveys
app.get('/api/surveys', async (req, res) => {
  // NEW DB CODE
  const client = await pool.connect();

  const query = `
  SELECT name
  FROM Survey
  `;

  const values = [];

  client.query(query, values)
    .then(result => {
      const jsonData = result.rows;
      const surveys = jsonData.map(survey => survey.name);
      // Process the returned JSON data
      res.json({surveys: surveys});
    })
    .catch(error => {
      // Handle the error
      console.error(error);
    })
    .finally(() => client.release());
    
});

// GET API endpoint for status of survey creation
app.get('/api/surveyStatus', async (req, res) => {
  const { surveyName = '' } = req.query;

  if(surveyName === '' || surveyName === 'undefined' || surveyName === null || surveyName === 'null') {
    res.status(404).json({ message: 'Survey name not found.' });
    return;
  }
  const client = await pool.connect();

  // NEW DB CODE
  const query = `
  SELECT 
  s.name AS survey_name, 
  COUNT(r.respondent_id) AS number_of_respondents, 
  (s.questions IS NULL) AS is_questions_null
FROM 
  Survey s
LEFT JOIN 
  Respondent r ON s.name = r.survey_name
WHERE 
  s.name = $1
GROUP BY 
  s.name, s.questions;
  `;


  const values = [surveyName];

  client.query(query, values)
    .then(result => {
      const { number_of_respondents, is_questions_null } = result.rows[0];
      // Process the returned values
      console.log(number_of_respondents, is_questions_null)
      res.json( {
        userDataStatus: number_of_respondents >  1 ? true : false,
        questionDataStatus: !is_questions_null
      });
    })
    .catch(error => {
      // Handle the error
      console.error(error);
    })
    .finally(() => client.release());

});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});