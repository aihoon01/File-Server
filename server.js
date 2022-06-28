//Import npm
import express, {json }  from "express";
import zip from "express-zip";
import cors from "cors";
import pool from "./model/db.js";
import uploadLib from "express-fileupload";
import nodemailer from "nodemailer"

//import routes
import loginRouter from "./controller/routes/login.js";
import signupRouter from "./controller/routes/signup.js";
import forgotPassword from "./controller/routes/forgotPassword.js";
// import req from "express/lib/request";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin:process.env.URL || '*'
}));

// app.use(cors());

app.use(uploadLib());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//Routes api

app.use('/login ', loginRouter);
app.use('/signup', signupRouter);
app.use('/forgotPassword',  forgotPassword)

// ************    inside file page ***************


app.get('/', loginRouter);

//Get All Files
app.get('/allFiles', async (req, res) => {
    try {
        const boards = await pool.query("SELECT * FROM files");
        res.json(boards.rows); 
    } catch (error) {
        console.log(error.message);
        
    }
});

//File search
app.post('/fileSearch', async(req, res) => {
    try {
        const {search} = req.body;
        const filename = await pool.query(`SELECT * FROM files WHERE title LIKE "%${search}%" `)
        res.json(filename.rows);
    } catch (error) {
        console.log(error.message);
        
    }

});


//Uploading a file
app.post('/fileUpload', async(req, res)=> {
    console.log("here we are")
    const {title, description} = req.body;
    console.log(req.body);
    console.log(req.files.file);
    if(req.files) {
        const file = req.files.file;
        const filename = file.name;
        console.log(filename)
        // file.mv("./model/uploadedFiles"+filename, async(err)=> {
        file.mv("./model/uploadedFiles/"+filename, async(err)=> {
            if(err) {
                res.send("error occured");
            }
            else {
                try {
                const response = await pool.query('INSERT INTO files (title, description, filename) VALUES($1, $2, $3) returning *', [title, description, filename]);  
                if(response) {
                    res.json("File added successfully");
                }
                // res.json(response.rows[0]);
                } catch (error) {
                    console.log(error.message)
                    
                }
                
            }
        });
    }

});

//Download File
app.get('/fileDownload', async(req, res) =>{
    console.log("we are here")
    const {filename, fileid} = req.query;
    console.log(filename, fileid);
    console.log(req.query);
    res.zip([{
        path: `./uploadedFiles/${filename}`, name: `${filename}`
    }]);

    try {
        const response = await pool.query(`INSERT INTO downloads (downloadfile) VALUES(${fileid})`);
        if(response){
            res.send("Successfully downloading");
            // const downloadCount = await pool.query(`UPDATE downloads SET downloaded = ${downloads.downloaded}+1 WHERE files_id = ${fileId}`);
            // if (downloadCount) {
            //     res.send("downloads updated");
            // } else {
            //     res.send("Couldn't download");
            }
        else {
            res.send("Something is wrong with file.");
        }
                
    } catch (error) {
        console.log(error.message);
    }
});

//email files
app.post('/fileEmail', async(req, res) =>{
    const { fileId, recepientEmail } = req.body;
    let fileName ="";

    try {
        const response = await pool.query(`SELECT fileName FROM files WHERE fileId = ${fileid}`);
        response.rows.forEach(row => {
            fileName = row.fileName;
        });

    } catch (error) {
        console.log(error.message);
    }

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'gardner.littel10@ethereal.email', // generated ethereal user
          pass: 'wuAQHdZaRu7Q7XcBqv', // generated ethereal password
        },
      });

      
    const msg = {
        from: '"The File Server" <info@fileserver.com>', // sender address
        to: `${recepientEmail}`, // list of receivers
        subject: "Emailled file", // Subject line
        text: "Please find attatch your a file", // plain text body
        attachments: [
          {   // file on disk as an attachment
            filename: `${fileName}`,
            path: `./uploadedFiles/${fileName}` // stream this file
          }
        ]
      };

      await transporter.sendMail(msg, async (err, info) => {
        if (err) console.error(err.message);
        try {
            
        const response = pool.query(`INSERT INTO emails (emailFile, emailAddr) VALUES (?,?)`,[fileId, recepientEmail] );
        res.json('File Sent');
        } catch (error) {
            console.log(error.message);
        }
});
});



//file emailed count
app.post('/fileEmailCount', async(req, res) =>{
    const {fileId} = req.body;
    let emailDownloadCount = [];
    try {
    const response = (`SELECT count(*) AS emailCount FROM emails WHERE emailFile = ${fileId}`);
    response.rows.forEach(row =>{
        emailDownloadCount.push(row);
        
    }) 
    } catch (error) {
        console.log(error.message);
        
    }

    await pool.query(`SELECT count(*) AS downloadCount FROM downloads WHERE downloadFile = ${fileId}`, (err, rows) => {
    if(err) return console.error(err.message);
        
    rows.forEach(row => {
      console.log(row);
      // res.json(row);
      // emailDownloadCount.downloadCount = row;
      emailDownloadCount.push(row);
      console.log(emailDownloadCount);
    });

    res.json(emailDownloadCount);
  
  });
});


app.listen(PORT, ()=> {
    console.log("server is listening on PORT: " + PORT)
});