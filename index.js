import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'

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

app.get('/auth/me', UserController.login)

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});