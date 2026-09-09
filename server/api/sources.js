const express = require('express')
const router = express.Router()
const data = require('../data')
const deployedSchoolIDs = require('../school-ids.json')

/**
 * Get the names of the supported schools
 * @return {Array<string>} short names (IDs) of schools
 */
const dataDirectories = async () => {
  return deployedSchoolIDs
}

router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store')
  try {
    const directories = await dataDirectories()
    const sources = await Promise.all(directories.map(async directory => {
      if (directory.startsWith('_')) return null
      try {
        const source = await data.getMeta(directory)
        source.id = directory
        return source
      } catch (e) {
        return null
      }
    }))
    res.json(sources.filter(x => x))
  } catch (e) {
    res.status(503).json({ error: 'School directory is temporarily unavailable' })
  }
})

router.get('/names', async (req, res) => {
  res.json(await dataDirectories())
})

module.exports = router
