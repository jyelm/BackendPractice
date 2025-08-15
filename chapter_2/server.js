//The address of this server connected to the netwrok is
// URL -> http://localhost:8383
// IP -> 127.0.0.1:8383
const express = require("express")
const app = express()
const PORT = 8383

let data = ["james"]

//Middleware
app.use(express.json())

//ENDPOINT HTTP VERBS  - method && Routes, or paths
//GET -> retrieve data - somebody is trying to get data from the backend
//POST -> create data
//PUT -> update data
//DELETE -> delete data
// the method informs the nature of rquest and the route is a further subdirectory (basically the request to the
// body of code to reqpond appropriateely, and these locations, or routes, are called endpoints, which is get in this instance)

//type 1-Website Endpoints (these are for sending back gtml and they tyoicallt come when a user enters a url in 
// a browser
app.get('/', (req, res) => {
    //this is endpoint numver 1 - /
    console.log("user requested the home page website")
    res.send(`
        <body
        style="background-color: pink; color: blue;">
        <H1>DATA:</H1>
            <p>${JSON.stringify(data)}</p> 
            <a href="/dashboard">Dashboard</a>
        </body>
        <script>
            console.log("the is my script")
        </script>
        `)
})

//a href creates a link for the user to navigate to another page, in this case from the home to the dashboard
app.get('/dashboard', (req, res) => {
    res.send(`
        <body>
        <h1>Dashboard</h1>
        <a href="/">Home</a>
        </body>`)

})

//type 2-API endpoints - non visual data
app.get('/api/data', (req, res) => {
    console.log('this onw was for data')
    res.status(599).send(data)
})

//CRUD-method; create read update and delete, where read i like get, create is like post,
// update is like put, and delete is like delete

app.post('/api/data', (req, res) => {
    //someone wants to crea a user for example when they click a sign up button
    // the user clicks the sign up button after enterinf their crentials, and their 
    //browser is wired up to send out a network request to the serber to handle that action
    const newEntry = req.body //this references gilgamesh in the test.rest file
    console.log(newEntry)
    data.push(newEntry.name) // essetially appends the post request data onto the data array
    res.sendStatus(201)
})

app.delete('/api/data', (req, res) => {
    data.pop()
    console.log('we deleted the element off the end of the array')
    res.sendStatus(204)
})

//always at teh bottom
app.listen(PORT, () => console.log(`Server has started ${PORT}`)) // use backticks for string interpolation; log is only created after the server has started
