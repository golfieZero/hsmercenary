import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from '../models/user.js'

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ $or: [{ email: req.body.email }, { login: req.body.login }] })
        if (!user) {
            return res.status(400).json({
                message: 'Неверно введён логин или пароль'
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passHash)
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверно введён логин или пароль'
            })
        }
        const token = jwt.sign({
            _id: user._id,
        }, 'cryptkeyverysecret',
            {
                expiresIn: '30d',
            },
        )
        // TODO: Возвращать только токен
        const { passHash, ...userData } = user._doc
        res.json({
            ...userData,
            token
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
}

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        // передаём данные в бд
        const doc = new UserModel({
            login: req.body.login,
            passHash: hash,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl
        });
        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id,
        }, 'cryptkeyverysecret',
            {
                expiresIn: '30d',
            },
        )
        // TODO: Возвращать только токен
        res.json({ token: token })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
}

export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id)
        const sanitizedUser = user.toJSON()
        return res.status(200).json(sanitizedUser)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить информацию о профиле',
        })

    }
}