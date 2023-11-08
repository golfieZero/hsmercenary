import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const getUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization; // Извлечение токена из заголовка Authorization

        if (!token) {
            return res.status(401).json({ message: 'Токен отсутствует' });
        }

        if (!token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Неверный формат токена' });
        }
        const tokenValue = token.slice(7); // Удаление "Bearer " из начала токена
        const decoded = jwt.verify(tokenValue, 'cryptkeyverysecret');
        if (!decoded || !decoded._id) {
            return res.status(401).json({ message: 'Неверный токен' });
        }

        const user = await UserModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Пользовтель не найден' });
        }
        // Добавляем пользователя к объекту запроса для дальнейшего использования

        req.user = user;
        next()
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Ошибка при получении пользователя' });
    }
}

export default getUser;