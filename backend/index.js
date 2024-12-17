const express = require('express')
require('dotenv').config()
const app = express();
const Database = require('./utils/dataBase')
const cookie = require('cookie-parser')
const cors = require('cors')

Database()

// app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookie())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


const authRouter = require('./routers/authRouter')


app.use('/api/v1/user', authRouter)


app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log(`Server is running ${process.env.PORT}`);
})