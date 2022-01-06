require('dotenv').config()

import path from 'path'
import express from 'express'
import swagger from './plugins/swagger'

import cors from 'cors'
import mongoose from 'mongoose'
import { address } from 'ip'
import componentsRoutes from './routes/components'

const port = process.env.PORT || 3000
const local = `http://localhost:${port}`
const remote = `http://${address()}:${port}`
const corsOptions = {
  origin: ['http://localhost:8080', 'localhost:3000'],
  optionsSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/images', express.static(path.join('public')))
app.use('/api/docs', swagger)

app.use('/api/stock', componentsRoutes)

start()

async function start() {
  const host = (process.env.NODE_ENV === 'production')
    ? process.env.MONGO_URL
    : 'mongodb://127.0.0.1:27017'
  const dbName = process.env.MONGO_INITDB_DATABASE
  const user = process.env.MONGO_INITDB_ROOT_USERNAME
  const pass = process.env.MONGO_INITDB_ROOT_PASSWORD
  try {
    await mongoose.connect(host, { dbName, user, pass })
    app.listen(port, () => console.log(`\n\nApp running at:\n- Local:  ${local}\n- Remote: ${remote}\n`))
  } catch (e) {
    console.warn('Error:', e)
  }
}