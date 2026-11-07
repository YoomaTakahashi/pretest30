require('dotenv').config({path:'.env'})
const express = require('express')
const fileUp = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

//-------------------------------------------------------global api -------------------------------------------------------------------------------\\

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const auth = require('./routes/auth')
app.use('/api/auth',auth)

//-------------------------------------------------------staff api ----------------------------------------------\\

const docnoe = require('./routes/docnoe')
app.use('/api/docnoe',docnoe )

//-------------------------------------------------------staff api ---------------------------------------------------------------------------\\

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva  )

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member  )

const score_commit = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_commit  )

//-------------------------------------------------------commit api ----------------------------------------------\\
const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const check = require('./routes/Commit/check')
app.use('/api/Commit/check',check  )

const signature = require('./routes/Commit/signature')
app.use('/api/Commit/signature',signature  )

const save_score = require('./routes/Commit/save_score')
app.use('/api/Commit/save_score',save_score)

app.use((req,res)=> res.status(404).json({message:"Route not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})