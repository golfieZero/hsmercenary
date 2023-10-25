import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
const PORT = 8000;
const app = express();
// подключаем валидацию
//const { registerValidation } = require('./validations/auth.js')
import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'

// Импортируем модель пользователя
import UserModel from './models/user.js'
//подключаем бд
mongoose
    .connect('mongodb+srv://golfiedev:golfiedev@cluster0.qyyqdfs.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('db error', err))

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }
//Шифруем пароль методом salt
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passHash = await bcrypt.hash(password, salt)
// передаём данные в бд
    const doc = new UserModel({
        login: req.body.login,
        passHash,   
        email: req.body.email,
        avatarUrl: req.body.avatarUrl
    });
    const user = await doc.save()
    res.json(user)
    })

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
  });