import express from 'express';
import pool from "../../model/db.js";

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    console.log("Hi");
try {
    const { email, password } = req.body;
    console.log(email, password);
    const signin = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password])
    // res.send('Email received')
    res.json(signin.rows)
} catch (error) {
    console.log(error.message);
}

})

export default loginRouter;