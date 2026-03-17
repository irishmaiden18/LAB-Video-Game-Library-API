// Get set up
// npm init -y
// npm install express morgan
// npm i uuid
// npm i lodash

// import express & morgan
const express = require("express")
const logger = require("morgan")

// set up app variable
const app = express()

// set up middleware

// morgan
app.use(logger("dev"))

// formats our express body
app.use(express.json())

// import router files
const gamesRouter = require("./routes/gamesRouter")
const platformsRouter = require("./routes/platformsRouter")

// set up URL routes to connect to each router
app.use("/api/v1/games", gamesRouter)
app.use("/api/v1/platforms", platformsRouter)

// set up port
const PORT = 3000

// begin listening
app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`)
})