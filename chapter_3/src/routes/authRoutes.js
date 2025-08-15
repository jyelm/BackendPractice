import express from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'  //creates a key that acts as a passwords for a user that allows authentication for a user so they dont have to re sign in
import db from '../db.js'

const router = express.Router()

//Refister a new user endpoint /auth/register
// body allows us to gain access tof the "body" of the json request
router.post('/register', (req, res) => {
    const {username, password} = req.body
    // save the username and irreversibly encrypted password
    //save jcelm | fjakdl;fladkfj...

    //encryot the password
    const hashedPassword = bcryptjs.hashSync(password, 8)
    //save the new user and hasehed password to db
    //prepare allows us to inject values into a sql query
    //values (?, ?) are placeholders for the values we want to insert
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) 
            VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // now that we have the user saved, I want to add their first todo for them
        const defaultTodo = `Hello! add your first todo`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        // allows it to where a client doesnt have to continuously rendter their login credentials
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})

        // send the token back to the client
        res.json({token})
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
    
})

router.post('/login', (req, res) => {
    //we get their email and look up the passsword associated with that email in the databases
    //we get that back and see that it is encrypted so we cannot compare it to the on the user just used trying to login
    // so what we can to is again one wat encryot the password the user just entered and compare it to the one in the database

    const {username, password} = req.body
    //prepare preps the database to be real, each column "which is what select * meanrs" where the username is some value
    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username) // are the username and hashed password in the database inextricably linked?
        //guard clauses; if we cannnot find a user associated with that username, return out of the function
        if (!user) {return res.status(404).send({message:"User not found"})}

        const passwordIsValid = bcryptjs.compareSync(password, user.password)
        //if the password does not match, return out of the function
        if (!passwordIsValid) {return res.status(401).send({message:"Invalid password"})}
        console.log(user)
        //have a succesful authentication
        // the id: user.id is the encoding for the token, which is why decoded.id exists in the verify
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router