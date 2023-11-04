import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'
import { cardCreateValidation } from './validations/post.js'
import { validationResult } from 'express-validator'
import checkAdminRole from './validations/admin.js'

import CardModel from './models/cards.js'

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

app.get('/cards/', async (req, res) => {
    try {
        const cards = await CardModel.find()
        return res.json(cards)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить карты',
        })
    }
})

app.post('/admin/cards/create', checkAdminRole, cardCreateValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(res)
            return res.status(400).json(errors.array())
        }

        const doc = new CardModel({
            name: req.body.name,
            description: req.body.description,
            abilities: req.body.abilities,
            imageUrl: req.body.imageUrl,

        });
        await doc.save()
        res.status(200).json({
            message: 'Успех!',
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать карты',
        })
    }
})



app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});