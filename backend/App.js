const cors = require('cors')
const express = require('express')
const PORT = 9999
const app = express()
const connectDB = require('./config/db')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://localhost:3000']
    }
});
app.use(cors());
const postModel = require('./db/post')
const logModel = require('./db/loger')
io.on('connection', socket => {
    socket.on('addpost', async (post) => {
        let ins = await new postModel(post);
        await ins.save((err) => {
            if (err) throw err;
            postModel.find({}, (err, data) => {
                io.emit('displaypost', data)
            })
        })
    })
    socket.on('addcomment', async (comment) => {
        await postModel.updateOne(
            { _id: comment.id },
            { $push: { comments: comment.comment } }
        ).exec((err) => {
            if (err) throw err;
            postModel.find({}, (err, data) => {
                let sendinfo = { data: data, cupdate: { ...comment } }
                io.emit('refresh', sendinfo)
            })
        })
    })
})
app.post('/api/adduser', (req, res) => {
    let ins = new logModel(req.body);
    ins.save((err) => {
        if (err) { res.send("Email Already Exist") }
        else { res.send('User Registered') }
    })
})
app.post('/api/getuser', (req, res) => {
    logModel.findOne({ user: req.body.user }, (err, data) => {
        if (err) {
            res.json({ "err": true, "msg": "Email or password is not correct" })
        }
        else if (data == null) {
            res.json({ "err": true, "msg": "Register first" })
        }
        else {
            // console.log(data)
            if (req.body.pass != data.pass) {
                res.json({ "err": true, "msg": "Password Not match" })
            }
            else {
                res.json({ "err": false, "msg": "Login Success", "user": data })
            }

        }
    })

})
app.get('/api/getpost', (req, res) => {
    postModel.find({}, (err, data) => {
        res.send(data)
    })
})
connectDB();
app.listen(PORT, (err) => {
    if (err) throw err;
    else {
        console.log(`Working on PORT ${PORT}`)
    }
})