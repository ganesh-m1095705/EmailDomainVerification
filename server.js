process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import axios from "axios"
import multer from 'multer';
import express from 'express';
import { getNonCheckedData, getOldEmailData, writeEmailData, createNewFile, getLastIndex } from './public/helpers/handleExcelData.js';

var app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.set('view engine', 'ejs');

let validatedEmails = []
let status = 'error'

const validateEmail = async (emailAddress) => {
  const response = await axios.get(`https://www.ipqualityscore.com/api/json/email/DHsWi3Pdk1BQrO8cr0JaxUdldoFIFkCt/${emailAddress}`).then((response)=>{
      const res = response.data
      validatedEmails.push({'Email Domain' : res.sanitized_email.split('@')[1], 'Disposable Status': res.disposable})
  })
}

// index page
app.get('/', function(req, res) {
  status = 'processing...'
  res.render('pages/index', { status });
});

app.post('/upload', upload.single('excelFile'), (req, res) => {
  try {
    validatedEmails = []
    const emailData = getOldEmailData().map(item => item['Email Domain'])
    console.log(emailData, 'in line 35')
    const nonCheckedEmailData = getNonCheckedData(req.file.buffer).map(item => ({'Email Domain': item['Email Domain']}))
    console.log(nonCheckedEmailData, 'in line 37')
    const newEmailData = nonCheckedEmailData.filter(obj => !emailData.includes(obj['Email Domain'])).map(item => `pggetest@${item['Email Domain']}`)
    console.log(newEmailData, 'in line 40')
    console.log('Succesfuly featched Email Data')

    console.log('Email domain varification request initiated')
    if(newEmailData.length !== 0){
      Promise.all(newEmailData.map(email => validateEmail(email))).then(() => {
        console.log(validatedEmails, 'verified data')
        writeEmailData(validatedEmails, getLastIndex())
        createNewFile(validatedEmails)
        console.log("All email data is verified")

        status = 'Excel Sheet updated Succesfuly'
        res.render('pages/index', { status });
      }).catch(error => console.error(error))
    } else {
      console.log('No Email Found, please upload only unverified email domain')
      status = 'No Email Found, please upload only unverified email domain'
      res.render('pages/index', { status });
    }
  } catch (error) {
    console.error('Error reading Excel file:', error.message);
    res.status(500).send('Error reading Excel file');
  }
  
});

app.get('/download-all', (req, res) => {
  res.download('./email_data/EmailDomainList.xlsx', 'EmailDomainList.xlsx', (err) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error downloading the EmailDomainList file')
    }
  })
})

app.get('/download-final', (req, res) => {
  res.download('./email_data/finalList.xlsx', 'finalList.xlsx', (err) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error downloading the finalList file')
    }
  })
})

app.listen(8080);
console.log('Server is listening on port 8080');