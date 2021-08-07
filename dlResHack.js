'use strict'
const fs = require('fs')
const request = require('request')
const rp = require('request-promise')
const path = require('path')
const extract = require('extract-zip')

function downloadResourceHacker() {
  return new Promise(async (resolve, reject) => {
    let url = 'http://www.angusj.com/resourcehacker/resource_hacker.zip'
    let filename = 'resource_hacker.zip'
    console.log('Downloading resource_hacker.zip ...')
    let data = await rp.get({ url: url, encoding: null })
    console.log('Saving resource_hacker.zip ...')
    await fs.promises.writeFile(filename, data)
    console.log('Extracting resource_hacker.zip ...')
    extract(filename, { dir: path.join(`${__dirname}`, 'resource_hacker') }, e => {
      if (e) { throw e }
      console.log(`ResourceHacker.exe extracted to ${path.join(__dirname, 'resource_hacker')}`)
      console.log('Deleting resource_hacker.zip ...')
      fs.unlink(path.join(__dirname, filename), resolve)
      console.log('Deletion of resource_hacker.zip complete.')
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
  console.log(`Please download http://www.angusj.com/resourcehacker/resource_hacker.zip and extract ResourceHacker.exe to ${path.join(__dirname, 'resource_hacker')}`)
}
