import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

//Get all todos for longed in user
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

//create a new todo
router.post('/', async (req, res) => {
    const {task} = req.body
    const todo = await prisma.todo.create({
        //Why does userId amd task need to be in the data object?
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)
})

//update a todo
//   /:id is a dynamic parameter
router.put('/:id', async (req, res) => {
    const {completed} =req.body
    const {id} = req.params //the infromtion followed by :
    const updateTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            completed: !!completed //double exclamation marks convert to boolean
        }
    })
    res.json({updateTodo})
})

//delete a todo
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    const deleteTodo = await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId: req.userId
        }
    })
    res.json({deleteTodo})
})

export default router