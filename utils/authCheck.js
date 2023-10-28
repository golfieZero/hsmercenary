import jwt from 'jsonwebtoken'
export default (req, res, next) =>{
    const token = req.headers.authorisation
    console.log(token)
}