const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const config = require('./config/key.js')
const { User } = require("./models/User")

//application/x-www-form-ulrencoded로 된 정보를 분석하여 가져옴
app.use(bodyParser.urlencoded({extended: true}))

//application/json으로 된 정보를 분석하여 가져옴
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world!'))

app.post('/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Port num : ${port}`))