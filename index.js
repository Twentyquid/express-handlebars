import express, { query } from 'express'
import cors from 'cors'
import { create } from 'express-handlebars'
import connection from './lib/sqlclient.js'
import apiv1 from "./routes/apiv1.js"
const app = express()
const port = 3005
const hbs = create({
  defaultLayout: false,
  // layoutsDir: './views/layouts',
  extname: '.hbs',
  helpers: {
    'formatnum': (value) => {
      return value.toLocaleString()
    },
    'formatdate': (value) => {
      const date = new Date(value)
      return date.toLocaleDateString('en-us', { month: 'long', day: 'numeric' })
    }
  }
})




connection.connect()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use('/api/v1', apiv1)
app.get('/', (req, res) => {
  // console.log(req.headers)
  res.sendFile('index.html', { root: "." })
})

app.get('/login', (_, res) => {
  res.status(200).render('login', { layout: 'default' })
})

app.post('/login', async (req, res) => {
  console.log(req.body);
  const query = `select a.id, a.name from accounts as a inner join users as u on a.userid = u.id where email='${req.body.email}';`
  let [results] = await connection.query(query)
  console.log(results[0])
  res.redirect(`/accounts/dashboard/${results[0].id}`)
})

app.get('/accounts/dashboard/:id', async (req, res) => {
  const { id } = req.params
  console.log(id)
  const query = `select name, curbalance from accounts where id=${id}`;
  const query2 = `select name, amount, DATE_FORMAT(date, '%Y-%m-%dT%TZ') as date from transactions where accountid=${id} order by date desc`
  let [result] = await connection.query(query)
  let [transactions] = await connection.query(query2)
  console.log(result[0])
  console.log(transactions)
  res.render('dashboard', { layout: 'default', ...result[0], transactions })
})

app.get('/data', async (_, res) => {
  const [results] = await connection.query('SELECT * FROM users;')
  res.status(200).json(results)
})

app.get('/layout', (_, res) => {
  res.render('home', { title: "wassup", layout: 'demo' })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

