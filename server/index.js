const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const config = require('./config/key.js')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

//application/x-www-form-ulrencoded로 된 정보를 분석하여 가져옴
app.use(bodyParser.urlencoded({extended: true}))

//application/json으로 된 정보를 분석하여 가져옴
app.use(bodyParser.json())

const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world!'))

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "일치하는 이메일이 없습니다."
            })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false,
                message: "비밀번호가 일치하지 않습니다."})

            user.genToken((err, user) => {
                if(err) return res.status(400).send(err)

                res.cookie("x_auth", user.token).status(200)
                .json({ loginSuccess:true, userId: user._id })
            })
        })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).send({ success: true })
    })
})


app.listen(port, () => console.log(`Port num : ${port}`))