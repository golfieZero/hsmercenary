import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const checkAdminRole = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: 'Токен отсутствует' });
    }

    const decoded = jwt.verify(token, 'cryptkeyverysecret');
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: 'Неверный токен' });
    }

    const user = await UserModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка при проверке роли' });
  }
};

export default checkAdminRole;