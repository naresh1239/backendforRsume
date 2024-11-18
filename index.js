const express = require('express')
const {connectdatabase} = require('./db.js')
const app = express()
const port = 8080
const userModel = require("./userShcema.js")
const resumeModel = require("./resumeShema.js")
const authRoute = require("./router/auth.js")
const bodyParser = require('body-parser')
const cors = require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/signupin',async(req, res) => {
console.log('vikas is here')
})
app.use("/auth",authRoute)


app.get('/api/task', async(req, res) => {
  const user = await userModel.find()
   res.json(user)
})
app.get('/api/AllResumes', async(req, res) => {
  const resumes = await resumeModel.find()
   res.json(resumes)
})
app.get('/api/GetResumebyid', async(req, res) => {
  const id =  req.query.id
  const resumes = await resumeModel.findById(id)
   res.json(resumes)
})
app.post('/api/SaveResume', async(req, res) => {
  const id =  req.query.id
  const data = req.body.data
  const orderby = req.body.orderby
  console.log(data)
  const resumes = await resumeModel.updateOne( { _id: id }, 
    {
      $set :{ ...data,orderby}
    }
  )
   res.json(resumes)
})

app.post('/api/gerateApi', async(req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY_GERERATE);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Template for structured output
const profileTemplate = `
Generate a JSON object with the following structure, customized based on the input:
{
    "firstName": "example",
    "lastName": "example",
    "jobTitle": "example",
    "address": "example",
    "phone": "example",
    "email": "example",
    "themeColor": "blue",
    "summary": "example",
    "backgroundColor" : "",
    "FontColor" : "",
    "experience": [
        {
            "id": 1,
            "title": "example",
            "companyName": "Amazon",
            "city": "New York",
            "state": "NY",
            "startDate": "Jan 2021",
            "currentlyWorking": true,
            "workSummary": "example",
            "_id": "671cee0a53ba276c4215db38"
        }
    ],
    "education": [
        {
            "id": 1,
            "universityName": "example",
            "startDate": "Aug 2018",
            "endDate": "Dec 2019",
            "degree": "Master",
            "major": "Computer Science",
            "description": "example",
            "_id": "671cee0a53ba276c4215db3a"
        }
    ],
    "skills": [
        {
            "id": 1,
            "name": "Node.js",
            "rating": 80,
            "_id": "671cee0a53ba276c4215db3b"
        },
        {
            "id": 2,
            "name": "Node.js",
            "rating": 95,
            "_id": "671cee0a53ba276c4215db3c"
        },
        {
            "id": 3,
            "name": "Node.js",
            "rating": 85,
            "_id": "671cee0a53ba276c4215db3d"
        },
        {
            "id": 4,
            "name": "React Native",
            "rating": 90,
            "_id": "671cee0a53ba276c4215db3e"
        }
    ],
    "orderby": [],
    "RatingType": 2
}

Given this input: "${req.body.data}". Fill this object according to your preferences and return a saved object without any comments. Return a plain object, filling all data as needed return plan object without Json qoutes.
`;


// Set up the prompt with the template and user data
const prompt = profileTemplate;
const result = await model.generateContent(prompt);


// Parse the JSON response text
let data;
try {
    data = JSON.parse(result.response.text()); // Parse the JSON string
} catch (error) {
    return res.status(400).send({ error: 'Invalid JSON response' }); // Handle parsing errors
}

// Create a new resume instance
const resumes = new resumeModel({ ...data });
console.log(resumes); // Logging the created resume instance

// Save the resume to the database
await resumes.save()
    .then(() => {
        res.status(201).send(resumes); // Send the saved resume as a response
    })
    .catch(err => {
        res.status(500).send({ error: 'Error saving resume', details: err });
    });
})


app.listen(port, () => {
  connectdatabase()
  console.log(`Example app listening on port ${port}`)
})