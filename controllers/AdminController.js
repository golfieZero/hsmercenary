import CardModel from '../models/cards.js'
import { validationResult } from 'express-validator'

export const getCards = async (req, res) => {
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

export const createCards = async (req, res) => {
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