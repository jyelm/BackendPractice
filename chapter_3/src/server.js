import express from 'express'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5003  //read the port from the .env file, defaults to 5000

//Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//get the directory name from the file path
const __dirname = dirname(__filename)

//Middleware
app.use(express.json())
//serves the html file from the /public directory
//tells express to serve all files from the pucliv folder as static assets/files
// any reqeusts for the css files will be resolved in the public folder
app.use(express.static(path.join(__dirname, '../public')))


//serving up the html file from the /public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Routes
app.use('/auth', authRoutes)  //throws /auth infront of all the routes in authRoutes.js
app.use('/todos',authMiddleware, todoRoutes) //quite literally ensure that the middleware is inbetween the route and the endpoints

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) //boilerplate code
