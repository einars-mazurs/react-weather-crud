require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./db')

const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/cities', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM cities ORDER BY id')
    res.json({ cities: result.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.post('/api/cities', async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  try {
    const result = await db.query(
      'INSERT INTO cities(name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id, name',
      [name]
    )
    // If insert did nothing because of conflict, fetch the existing row
    if (result.rows.length === 0) {
      const existing = await db.query('SELECT id, name FROM cities WHERE name = $1', [name])
      return res.json({ city: existing.rows[0] })
    }
    res.json({ city: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.put('/api/cities/:id', async (req, res) => {
  const { id } = req.params
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  try {
    const result = await db.query('UPDATE cities SET name = $1 WHERE id = $2 RETURNING id, name', [name, id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'not_found' })
    res.json({ city: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

app.delete('/api/cities/:id', async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM cities WHERE id = $1', [id])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'db_error' })
  }
})

async function start() {
  try {
    await db.initDb()
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
