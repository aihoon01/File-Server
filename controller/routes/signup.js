import express from 'express';
import pool from "../../model/db.js";



const signupRouter = express.Router();
signupRouter.post('/', async(req, res) => {
try {
    const {username, email, password} = req.body;
    const signon = await pool.query("INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *", [username, email, password]);
    res.json("User added successfully");
    // res.json(signon.rows[0]);
    console.log(signon.rows);
    
} catch (error) {
    console.log(error.message);
    
}
});

export default signupRouter;