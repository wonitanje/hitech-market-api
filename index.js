require('dotenv').config({ path: '.env.development' })

const ip = require('ip')
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieSession = require('express-session')
const SequelizeSessionStore = require("connect-session-sequelize")(cookieSession.Store)
const sql = require('./models')
const { authRoutes, tableRoutes } = require('./routes')(sql)

const port = process.env.PORT || 3000
const local = `http://localhost:${port}`
const remote = `http://${ip.address()}:${port}`
const dist = (process.env.NODE_ENV === 'production')
  ? path.join(__dirname + '/dist')
  : path.join(__dirname + '/../client/dist')

const corsOptions = {
  origin: ['http://localhost:80', 'http://localhost:8080', 'http://localhost:3001', 'https://fefu-market.herokuapp.com'],
  optionsSuccessStatus: 200,
  credentials: true
}

const secret = 'Juswee-Production-Secret-Keys_fefu-market'
const store = new SequelizeSessionStore({
  db: sql,
  expiration: 24 * 60 * 60 * 1000
})
const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: false,
}

const app = express()
app.use(cors(corsOptions))
app.use(cookieSession(sessionOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(dist))

app.use((req, res, next) => {
  console.log(req.url, req.method, !!req.session.isAuth)

  // if ((req.url === '/api/login' || req.body.secret === 'jusweeProd') && req.method === 'POST')
  //   return next()

  // if (req.session.isAuth !== true) {
  //   return res.redirect('/')
  // }

  next()
})

app.use(authRoutes)
app.use(tableRoutes)

app.get(/./, (req, res) => res.sendFile(`${dist}/index.html`))

async function start() {
  app.listen(port, () => {
    console.log(`\n\nApp running at:\n- Local:  ${local}\n- Remote: ${remote}\n`)
    sql.sync()
  })
}
start()