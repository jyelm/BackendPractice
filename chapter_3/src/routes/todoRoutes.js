import express from 'express'
import db from '../db.js'

const router = express.Router()

//Get all todos for longed in user
router.get('/', (req, res) => {
    const getTodos = db.prepare(`SELECT * FROM todos WHERE user_id = ?`) ///how do placeholder work? 
    const todos = getTodos.all(req.userId) //what is this req.userId?
    res.json(todos)
})

//create a new todo
router.post('/', (req, res) => {
    const {task} = req.body
    const insertTodo  = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
    const result = insertTodo.run(req.userId, task)
    res.json({id: result.lastInsertRowid, task, completed: 0})
})

//update a todo
//   /:id is a dynamic parameter
router.put('/:id', (req, res) => {
    const {completed} =req.body
    const {id} = req.params //the infromtion followed by :
    const {page} = req.query //the information followed by ? (not relevant in this project)
    const updateTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ?`)
    updateTodo.run(completed, id) //maybe these parameters need to be in the order of the sequence of question marks?
    res.json({message: 'Todo updated successfully'})
})

//delete a todo
router.delete('/:id', (req, res) => {
    const {id} = req.params
    const userID = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userID)
    res.json({message: 'Todo deleted successfully'})
})

export default router