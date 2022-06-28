import express from 'express';
// import { rows } from 'pg/lib/defaults';
import pool from '../../model/db.js';
import nodemailer from 'nodemailer';

const resetRouter = express.Router();

resetRouter.post('/', async(req, res)=>{
    console.log('endpointed')
try {
    const { email } = req.body;
    const response = await pool.query("SELECT * FROM users WHERE email = $1 ", [email]);
    res.json(response.rows[0]);
    console.log(response.rows.length);
    if(response.rows.length === 0) {
        res.json("Email not found");
    } else {
        response.rows.forEach(async row => {
            console.log(response.row.username);

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: 'garner.littel10@ethereal.email',
                    pass: 'wuAQHdZaRu7Q7XcBqv'
                }
            });

            const msg = {
                from: "'The File Server' <info@fileserver.com>",
                to: `${email}`,
                subject: "Reset Password",
                text: `Dear ${row.username}, \nPlease click the lin below to reset your password \n[link]`
            };
            let info = await transporter.sendMail(msg);
            console.log('Email Sent');
            res.json('Email sent');

        });
    }
} catch (error) {
    console.log(error.message);
    
}
});

export default resetRouter;