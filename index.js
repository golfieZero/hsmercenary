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
    .connect('')
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('db error:', err))

app.use(express.json());

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
// app.get('/auth/me', UserController.login)

app.get('/admin/cards', checkAdminRole, AdminController.getCards)
app.post('/admin/cards', checkAdminRole, cardCreateValidation, checkAdminRole, AdminController.createCards)

app.post('/posts', getUser, postCreateValidation, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        console.log(req.body.cards)
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
app.get('/posts', async (req, res) => {
    try {
        const posts = await PostModel.find()
        return res.json(posts)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить публикации',
        })
    }
})
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        return res.json(post)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить публикацию',
        })
    }
})
// app.put('/posts/:id', getUser, postCreateValidation, async (req, res) => {
//     try{
//         var post = PostModel.findById(req.params.id)
//         console.log(post.author)
//         console.log(req.user._id)
//         if (post.author !== req.user._id){
//             return res.status(400).json({
//                 message: "Нет доступа"
//             })
//         }
//         else{
//             return res.status(200)
//         }
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({
//             message: 'Не удалось обновить пост',
//         })
//     }
// })
app.delete('/posts/:id', getUser, async (req, res) => {
    try {
        
        const deletedPost = await PostModel.findByIdAndDelete(req.params.id)
        if (!deletedPost){
            return res.status(404).json({
                message: "Публикация не найдена"
            })
        }
        res.status(200).json({
            message: "Успех"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить пост',
        })
    }
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});
