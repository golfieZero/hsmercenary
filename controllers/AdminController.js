import CardModel from '../models/cards.js'
import { validationResult } from 'express-validator'

export const getAll = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const cards = await CardModel.find()
        return res.json(cards)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить карты',
        })
    }
}

export const create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(res)
            return res.status(400).json(errors.array())
        }

        const doc = new CardModel({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            abilities: req.body.abilities,

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
}

export const getOne = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const card = await CardModel.findById(req.params.id)
        if (!card) {
            return res.status(404).json({ message: "Карта не найдена" })
        }
        return res.json(card)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить карту',
        })
    }
}

export const update = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const updatedCard = await CardModel.findById(req.params.id)
        if (!updatedCard) {
            return res.status(404).json({
                message: "Карта не найдена"
            })
        }
        await updatedCard.updateOne({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            abilities: req.body.abilities,
        })
        res.status(200).json({
            message: "Успех"
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить карту',
        })
    }
}

export const deleteOne = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const deletedCard = await CardModel.findById(req.params.id)
        if (!deletedCard) {
            return res.status(404).json({
                message: "Карта не найдена"
            })
        }
        await CardModel.findByIdAndDelete(req.params.id).exec()
        return res.status(200).json({
            message: "Успех"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить карту',
        })
    }
}