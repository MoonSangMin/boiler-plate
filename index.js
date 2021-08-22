const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://moon:anstkdals10@9@bolierplate.7tlrg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello world!'))

app.listen(port, () => console.log(`Port num : ${port}`))