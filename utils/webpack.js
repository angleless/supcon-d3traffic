const fs = require('fs')
const path = require('path')

/**
 * @param {string} folderPath
 * @returns [] AbsolutePathFiles
 */

function getAbsolutePathFiles (folderPath) {
  return fs.readdirSync(folderPath).map(v => path.join(folderPath, v))
}

function getDirectoryNames (absolutePathFiles) {
  const absoluteDirectoryName = absolutePathFiles.reduce((p, c, i, a) => (fs.statSync(c).isDirectory() ? p.concat(c) : p), [])
  return absoluteDirectoryName.map(v => path.basename(v))
}

function getWebapckEntryObj (directoryNames) {
  const entryEntries = directoryNames.reduce((p, c, i, a) => {
    const k = `${c}/index`
    const v = path.resolve(__dirname, '..', `src/lib/${c}/index.js`)
    return p.concat([[k, v]])
  }, [
    ['index', path.resolve(__dirname, '..', 'src/lib/index.js')],
    ['app', path.resolve(__dirname, '..', 'src/lib/app.js')]
  ])

  return Object.fromEntries(entryEntries)
}

module.exports = {
  getAbsolutePathFiles,
  getDirectoryNames,
  getWebapckEntryObj
}
