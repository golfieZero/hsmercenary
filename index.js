import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'
import { cardCreateValidation, postCreateValidation } from './validations/post.js'
import * as AdminController from './controllers/AdminController.js'
import { validationResult } from 'express-validator'
import checkAdminRole from './validations/admin.js'

import getUser from './middleware/userJwtInfo.js'

import CardModel from './models/cards.js'
import PostModel from './models/posts.js'

const PORT = 8000;
const app = express();
//подключаем бд
mongoose
    .connect('mongodb+srv://golfiedev:golfiedev@cluster0.qyyqdfs.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('db error:', err))

app.use(express.json());

app.post('/auth/login', UserController.login)

app.post('/auth/register', registerValidation, UserController.register)

// app.get('/auth/me', UserController.login)

app.get('/admin/cards', checkAdminRole, AdminController.getCards)

app.post('/admin/cards', checkAdminRole, cardCreateValidation, checkAdminRole, AdminController.createCards)
// допилить валидацию карт
app.post('/posts', getUser, postCreateValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }          
        const cardsId = []
        for (const card in req.body.cards){
            cardsId.push(await PostModel.findOne({name: req.body.cards.name}))

        }
        console.log(cardsId)
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            author: req.user._id,
            cards: req.body.cards,
        });
        await doc.save()
        res.status(200).json({
            message: 'Успех!',
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
})
app.get('/posts/:id')

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});