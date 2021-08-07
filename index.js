'use strict'
const fs = require('fs')
const run = require('child_process').execSync
const request = require('request')
const rp = require('request-promise')
const path = require('path')

/**
 * Change the icon of an executable file.
 * @param {string} exe - The name of the executable file.
 * @param {string} img - The name of the image to be used as an icon. 
 * You must supply an ICO image. 
 */
async function icon(exe, img) {
  if (img.endsWith('.ico')) {
    let icon = img
    console.log(`Changing icon of ${exe} to ${icon} ...`)
    return new Promise((resolve, reject) => {
      let args = `-open "${exe}" -save "${exe}" -action addoverwrite -res "${icon}" -mask ICONGROUP,MAINICON,`
      run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
      console.log('Icon successfully changed!')
      resolve()
    })
  } else {
    console.error('You must use an .ico format sadly')
  }
}

/**
 * Change the VersionInfo of an executable file, such as CompanyName, App Description.
 * @param {string} exe - The name of the executable file.
  * @param {{
  * CompanyName: string,
  * FileDescription: string, 
  * FileVersion: string,
  * LegalCopyright: string,
  * OriginalFilename: string,
  * ProductName: string,
  * ProductVersion: string
  * }} metaData - The desired metadata. FileVersion and ProductVersion must be formatted like 1.2.3.4
 */
async function versionInfo(exe, metaData) {
  console.log('Generating VersionInfo script file from the following data:')
  console.log(metaData)
  await writeScript(metaData)
  console.log('Compiling VersionInfo script file into resource file ...')
  await compileScript(path.join(__dirname, 'VersionInfo.rc'))
  console.log('Deleting VersionInfo script file ...')
  await fs.unlinkSync(path.join(__dirname, 'VersionInfo.rc'))
  console.log(`Changing VersionInfo of ${exe} ...`)
  await changeMetaData(exe, path.join(__dirname, 'VersionInfo.res'))
  console.log('Deleting VersionInfo resource file ...')
  await fs.unlinkSync(path.join(__dirname, 'VersionInfo.res'))
  console.log('VersionInfo updated!')
}

async function writeScript(metaData) {
  metaData.FileVersion = metaData.FileVersion || '1.0.0.0'
  metaData.ProductVersion = metaData.ProductVersion || '1.0.0.0'
  let FILEVERSION = metaData.FileVersion.replace(/\./g, ',')
  let PRODUCTVERSION = metaData.ProductVersion.replace(/\./g, ',')
  let keys = Object.keys(metaData)
  keys.forEach(key => { metaData[key] = `            VALUE "${key}", "${metaData[key]}"` })
  let block = Object.values(metaData).join(`\n`)
  let scriptContents = fs
    .readFileSync(path.join(__dirname, 'template.rc'), 'utf8')
    .replace('${FILEVERSION}', FILEVERSION)
    .replace('${PRODUCTVERSION}', PRODUCTVERSION)
    .replace('${block}', block)
  fs.writeFileSync(path.join(__dirname, 'VersionInfo.rc'), scriptContents)
}

async function compileScript(scriptFileName) {
  let args = `-open "${scriptFileName}" -save "${scriptFileName.replace('.rc', '.res')}" -action compile -res`
  run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
}

async function changeMetaData(exe, resFileName) {
  let args = `-open "${exe}" -save "${exe}" -action addoverwrite -res "${resFileName}" -mask versioninfo,1`
  run(`"${path.join(__dirname, 'resource_hacker', 'ResourceHacker.exe')}" ${args}`)
}

module.exports.icon = icon;
module.exports.versionInfo = versionInfo;