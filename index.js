import express from 'express'
import mongoose from 'mongoose'
import * as UserController from './controllers/UserController.js'
import { registerValidation } from './validations/auth.js'
import { cardCreateValidation, postCreateValidation } from './validations/post.js'
import * as PostController from './controllers/PostController.js'
import * as AdminController from './controllers/AdminController.js'
import checkAdminRole from './validations/admin.js'
import getUser from './middleware/userJwtInfo.js'



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

app.post('/posts', getUser, postCreateValidation, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.patch('/posts/:id', getUser, postCreateValidation, PostController.update)
app.delete('/posts/:id', getUser, PostController.deleteOne)

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});