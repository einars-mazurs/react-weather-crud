const { Pool } = require('pg')
const defaultCities = [
  'New York',
  'London',
  'Tokyo',
  'Paris',
  'Sydney',
  'Moscow',
  'Mumbai',
  'Beijing',
  'Rio de Janeiro',
  'Riga',
]

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/weather'
const pool = new Pool({ connectionString })

async function initDb() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    )`
  )

  const { rows } = await pool.query('SELECT COUNT(*) AS cnt FROM cities')
  const count = parseInt(rows[0]?.cnt || '0', 10)
  if (count === 0) {
    const insertText = 'INSERT INTO cities(name) VALUES ($1) ON CONFLICT DO NOTHING'
    for (const city of defaultCities) {
      await pool.query(insertText, [city])
    }
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
}
