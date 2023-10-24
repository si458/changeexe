'use strict'
const fs = require('fs')
const http = require('http')
const { join } = require('path')
const AdmZip = require('adm-zip')

function downloadResourceHacker() {
  return new Promise(async (resolve, reject) => {
    let url = 'https://www.angusj.com/resourcehacker/resource_hacker.zip'
    let filename = 'resource_hacker.zip'
    console.log(`Downloading ${filename} ...`)
    http.get(url, (res) => {
      const filePath = fs.createWriteStream(join(__dirname, filename))
      res.pipe(filePath)
      filePath.on('finish', () => {
        filePath.close()
        console.log('Download Completed')
        console.log(`Extracting ${filename} ...`)
        const zip = new AdmZip(filename)
        zip.extractAllTo(join(__dirname, 'resource_hacker'), true)
        console.log(`ResourceHacker.exe extracted to ${join(__dirname, 'resource_hacker')}`)
        console.log('Deleting resource_hacker.zip ...')
        fs.unlink(join(__dirname, filename), resolve)
        console.log('Deletion of resource_hacker.zip complete.')
        resolve()
      })
    })
  })
}

try {
  console.log('The license of ResourceHacker.exe forbids distribution with this NPM package, so it will be downloaded at this time.')
  downloadResourceHacker()
}
catch (e) {
  console.log(e)
  console.log('ResourceHacker.exe could not be downloaded.')
  console.log(`Please download https://www.angusj.com/resourcehacker/resource_hacker.zip and extract ResourceHacker.exe to ${join(__dirname, 'resource_hacker')}`)
}