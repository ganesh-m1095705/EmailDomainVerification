import * as XLSX from 'xlsx'

// const fileName = './email_data/EmailDomainList.xlsx'
// const sheetName = 'Sheet1'
// // Reading our test file 
// const file = XLSX.read(fileName, { type: 'file' })
// const existingSheet = file.Sheets[sheetName]

export const getOldEmailData = () => {
    const fileName = './email_data/EmailDomainList.xlsx'
    const file = XLSX.read(fileName, { type: 'file' })
    let data = [] 
    const sheets = file.SheetNames 
    for(let i = 0; i < sheets.length; i++) { 
        const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => { 
            data.push(res) 
        }) 
    }
    return data
}

export const getNonCheckedData = (fileBuffer) => {
    const file = XLSX.read(fileBuffer, { type: 'buffer' })
    let data = [] 
    const sheets = file.SheetNames 
    for(let i = 0; i < sheets.length; i++) { 
        const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => { 
            data.push(res) 
        }) 
    }
    return data
}

export const getLastIndex = () => {
    const fileName = './email_data/EmailDomainList.xlsx'
    const sheetName = 'Sheet1'
    // Reading our test file 
    const file = XLSX.read(fileName, { type: 'file' })
    const existingSheet = file.Sheets[sheetName]
    const lastRowIndex = XLSX.utils.decode_range(existingSheet['!ref']).e.r
    return lastRowIndex
}

export const writeEmailData = (email_data, index) => {
    const fileName = './email_data/EmailDomainList.xlsx'
    const sheetName = 'Sheet1'
    // Reading our test file 
    const file = XLSX.read(fileName, { type: 'file' })
    const existingSheet = file.Sheets[sheetName]
    XLSX.utils.sheet_add_json(existingSheet, email_data, { skipHeader: true, origin: index + 1 })
    
    // Writing to our file 
    XLSX.writeFile(file, fileName) 
}

export const createNewFile = (email_data) => {
    const fileName = './email_data/finalList.xlsx'
    const sheetName = 'Sheet1'
    const file = XLSX.read(fileName, { type: 'file' })
    const existingSheet = file.Sheets[sheetName]

    //clear the sheet before pushing new values
    const headerRef = existingSheet['!ref'].split(':')[0];
    existingSheet['!ref'] = headerRef;
    XLSX.writeFile(file, fileName)

    // now push new values
    XLSX.utils.sheet_add_json(existingSheet, email_data, { skipHeader: true, origin: 'A2' })
    
    // Writing to our file
    XLSX.writeFile(file, fileName)
}
