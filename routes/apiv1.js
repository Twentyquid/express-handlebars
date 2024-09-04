import { Router } from "express";
import connection from "../lib/sqlclient.js";

const route = Router();

route.get('/users/', async (_, res) => {
    const [results] = await connection.query('select * from users;')
    res.render('users', { user: results })
})

route.get('/accounts', async (req, res) => {
    const id = req.query.id;
    const [results] = await connection.query(`select * from accounts where id = ${id}`)
    res.render("account", { account: results[0] })
})

export default route