import { body } from 'express-validator'

// Проверка запросов валидатором
export const postCreateValidation = [
    body('title', 'Заголовок должен содержать более 5 символов').isLength({ min:5 }),
    body('text', 'Текст должен содержать более 20 символов').isLength({ min: 20 }),
    body('cards', 'Карты переданы неверно').isArray()
]

export const cardCreateValidation = [
    body('name').isString().notEmpty(),
    body('description').isString(),
    body('imageUrl').isURL(),
    body('abilities').isArray(),
    body('abilities.*.name').isString().notEmpty(),
    body('abilities.*.description').isString(),
    body('abilities.*.level').isInt({ min: 1, max: 3 }),
    body('abilities').custom((abilities) => {
        if (abilities.length > 3) {
          throw new Error('Количество способностей не может быть больше 3');
        }
        return true;
      }),
  ]