import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'] //this accesses token sent from the html file

    if (!token) {return res.status(401).json({message: "no token provided"})}

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {return res.status(401).json({message: "Invalid token"})}
        req.userId = decoded.id
        next()
    })
}

export default authMiddleware
