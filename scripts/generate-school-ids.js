const fs = require('fs')
const path = require('path')

const projectDirectory = path.join(__dirname, '..')
const schedulesDirectory = path.join(projectDirectory, 'schedules')
const outputFile = path.join(projectDirectory, 'server', 'school-ids.json')

const schoolIDs = fs.readdirSync(schedulesDirectory, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
  .map(entry => entry.name)
  .sort((left, right) => left.localeCompare(right))

if (schoolIDs.length < 100) {
  throw new Error(`Only found ${schoolIDs.length} schools; refusing to write an incomplete directory.`)
}

fs.writeFileSync(outputFile, `${JSON.stringify(schoolIDs, null, 2)}\n`)
console.log(`Wrote ${schoolIDs.length} school IDs to ${path.relative(projectDirectory, outputFile)}.`)
