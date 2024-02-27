process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import axios from "axios"
import {getEmailData, getNonCheckedData, getLastIndex, writeEmailData, createNewFile} from "./handleExcelData.js";

let validatedEmails = []

const emailData = getEmailData().map(item => item['Email Domain'])
const nonCheckedEmailData = getNonCheckedData().map(item => ({'Email Domain': item['Email Domain']}))
const newEmailData = nonCheckedEmailData.filter(obj => !emailData.includes(obj['Email Domain'])).map(item => `pggetest@${item['Email Domain']}`)

console.log(newEmailData)
console.log('Succesfuly featched Email Data')

const validateEmail = async (emailAddress) => {
    const response = await axios.get(`https://www.ipqualityscore.com/api/json/email/DHsWi3Pdk1BQrO8cr0JaxUdldoFIFkCt/${emailAddress}`).then((response)=>{
        const res = response.data
        validatedEmails.push({'Email Domain' : res.sanitized_email.split('@')[1], 'Disposable Status': res.disposable})
    })
}

console.log('Email domain varification request initiated')
if(newEmailData.length !== 0){
    Promise.all(newEmailData.map(email => validateEmail(email))).then(() => {
        console.log(validatedEmails, 'verified data')
        writeEmailData(validatedEmails, getLastIndex())
        createNewFile(validatedEmails)
        console.log("All email data is verified")
    }).catch(error => console.error(error))
} else {
    console.log('No Email Found, please upload only unverified email domain')
}

