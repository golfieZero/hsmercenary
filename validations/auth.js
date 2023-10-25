import { body } from 'express-validator'

// Проверка запросов валидатором
export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать не мене 6 символов').isLength({ min: 6 }),
    body('login', 'Логин должен быть не менее 3 символов').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка').optional().isURL(),
]
