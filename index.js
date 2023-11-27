import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'
import { cardCreateValidation, postCreateValidation } from './validations/post.js'
import * as PostController from './controllers/PostController.js'
import * as AdminController from './controllers/AdminController.js'
import checkAdminRole from './validations/admin.js'
import getUser from './middleware/userJwtInfo.js'

import dotenv from 'dotenv';
dotenv.config();


const app = express();
//Убрать в локальную переменную
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('Db connected'))
    .catch((err) => console.log('db error:', err))

app.use(express.json());

app.post('/auth/login', UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', getUser, UserController.profile)

app.get('/admin/cards', checkAdminRole, AdminController.getAll)
app.post('/admin/cards', checkAdminRole, cardCreateValidation, checkAdminRole, AdminController.create)
app.get('/admin/cards/:id', checkAdminRole, AdminController.getOne)
app.patch('/admin/cards/:id', checkAdminRole, cardCreateValidation, AdminController.update)
app.delete('/admin/cards/:id', checkAdminRole, AdminController.deleteOne)


app.post('/posts', getUser, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.patch('/posts/:id', getUser, postCreateValidation, PostController.update)
app.delete('/posts/:id', getUser, PostController.deleteOne)

app.listen(process.env.PORT, () => {
    console.log(`Сервер запущен на порте ${process.env.PORT}`);
});