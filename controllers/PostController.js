import PostModel from '../models/posts.js'
import { validationResult } from 'express-validator'

export const create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
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
}

export const getAll = async (req, res) => {
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
}

export const getOne = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: "Публикация не найдена" })
        }
        return res.json(post)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить публикацию',
        })
    }
}

export const update = async (req, res) => {
    try {
        const updatedPost = await PostModel.findById(req.params.id).populate('author')
        if (!(updatedPost.author._id.equals(req.user._id) || req.user.role == 'admin')) {
            return res.status(400).json({
                message: "Недостаточно прав"
            })
        }
        if (!updatedPost) {
            return res.status(404).json({
                message: "Публикация не найдена"
            })
        }
        await updatedPost.updateOne({
            title: req.body.title,
            text: req.body.text,
            author: req.user._id,
            cards: req.body.cards,
        })
        res.status(200).json({
            message: "Успех"
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить пост',
        })
    }
}

export const deleteOne = async (req, res) => {
    try {
        const deletedPost = await PostModel.findById(req.params.id).populate('author')
        if (!(deletedPost.author._id.equals(req.user._id) || req.user.role == 'admin')) {
            return res.status(400).json({
                message: "Недостаточно прав"
            })
        }
        if (!deletedPost) {
            return res.status(404).json({
                message: "Публикация не найдена"
            })
        }
        await PostModel.findByIdAndDelete(req.params.id).exec()
        return res.status(200).json({
            message: "Успех"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить пост',
        })
    }
}