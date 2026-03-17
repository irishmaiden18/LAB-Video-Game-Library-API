// import express & uuid
const express = require("express")
const uuid = require("uuid").v4

// set up router
const router = express.Router()

// import game data
let games = require("../data/games")

// set all the data to lower case for consistent sorting
let gamesData = games.map((game) => {
    return {
        id: game.id,
        name: game.name.toLowerCase(),
        genres: game.genres.map(genre => genre.toLowerCase()),
        releaseYear: game.releaseYear,
        platforms: game.platforms.map(platform => platform.toLowerCase())
    }
})

// import sort function
const sort = require("../utils")

// handles GET requests
// gets a list of games
router.get("/", (req, res) => {

    // use query parameters to figure out how to sort
    // if there are no parameters, sort by name in ascending order
    let sortBy = req.query.sortBy || "name"
    const order = req.query.order || "asc"

    // sortBy can be "name" or "releaseYear" but we dont' want releaseYear to be all lower case
    if (sortBy.toLowerCase() === "name") {
        
        // lower case for consistent sorting
        sortBy = sortBy.toLowerCase()
    }

    // sortBy can be "name" or "releaseYear" but we dont' want releaseYear to be all lower case
    if (sortBy.toLowerCase() === "releaseyear") {

        // reformat for consistent sorting
        sortBy = "releaseYear"
    }

    // re-case the order parameter to be lower case for consistent sorting
    orderCased = order.toLowerCase()

    // call sort function
    const sortedGames = sort(gamesData, sortBy, orderCased)

    
    // if there is a query parameter "platform", e.g. ?platform=PC
    if (req.query.platform) {

        // create a results array made up of all games that list that platform in their platforms property
        const results = sortedGames.filter((game) => {
            return game.platforms.includes(req.query.platform.toLowerCase())
        })

        // if the results array exists
        if (results.length > 0) {

            // send a response including the games that work on the querried platform
            res.json({
                message: "success",
                payload: results
            })

        // if there are no games in the results array
        } else {

            // send a response that includes an empty array
            res.status(404).json({
                message: "failure",
                messageDetail: "There are no games that work on the queried platform",
                payload: []
            })
        }
    
    // else if there is a query parameter "genre", e.g. ?genre=RPG
    } else if (req.query.genre) {

        // create a results array made up of all games that list that genre of game play in their genres property
        const results = sortedGames.filter((game) => {
            return game.genres.includes(req.query.genre.toLowerCase())
        })

        // if the results array exists
        if (results.length > 0) {

            // send a response including the games that use the querried game play genre
            res.json({
                message: "success",
                payload: results 
            })
        // if there are no games in the results array
        } else {

            // send a response
            res.status(404).json({
                message: "failure",
                messageDetail: "There are no games that in the queried genre",
                payload: []
            })
        }

    // else if there is a query parameter "year", e.g. ?year=2025
    } else if (req.query.year) {

        // create a results array made up of all the games that were released in the queried year, have the queried year in their "releaseYear" property
        const results = sortedGames.filter((game) => {
            return game.releaseYear === Number(req.query.year)
        })

        // if the results array exists
        if (results.length > 0) {

            // send a response including the games released in the queried year
            res.json({
                message: "success",
                payload: results
            })

        // if there are no games in the results array
        } else {

            // send a response
            res.status(404).json({
                message: "failure",
                messageDetail: "There are no games released in the year queried",
                payload: []
            })
        }
    
    // else if there is a query parameter "page" e.g. ?page=3
    } else if (req.query.page) {

        // 10 items will show per page
        const itemsPerPage = 10

        //calculate the number of pages required to display all the data
        let totalPages = Math.ceil(sortedGames.length / itemsPerPage)
        // console.log(`total pages: ${totalPages}`)

        // get the requested page from the user
        const requestedPage = req.query.page

        // if the requested page is less than or equal to the total number of pages required to display all the data
        if (requestedPage <= totalPages) {

            // get the start index of items to display based on the requested page and items per page
            startIndex = (requestedPage * itemsPerPage) - (requestedPage - 1) * itemsPerPage

            // get the end index by adding the itemsPerPage to the start index
            endIndex = startIndex + itemsPerPage

            // create a limited list of items to display using the start and end indexes calculated above
            limitedList = sortedGames.slice(startIndex, endIndex)

            // send a response with the limited list
            res.json({
                message: "success",
                payload: limitedList
            })
        // else if the requested page is greater than the total pages required to display the data
        } else if (requestedPage > totalPages) {

            // send an error response
            res.status(500).json({
                message: "failure",
                payload: `There are only ${totalPages} pages of games, please use a number less than ${totalPages}`
            })
        }

    // if there are no query parameters
    } else {

        // send a response with all the games
        res.json({
            message: "success",
            payload: sortedGames
        })
    }
})

// gets a single game based on uuid
router.get("/:id", (req, res) => {

    // find game we are looking for
    const foundGame = gamesData.find((game) => {
        return game.id === req.params.id
    })

    // if the game we are looking for is in our data
    if (foundGame) {

        // send a response
        res.json({
            message: "success",
            payload: foundGame
        })

    // if the game we are looking for is NOT in our data
    } else {
        // send a response
        res.status(404).json({
            message: "failure",
            payload: "The game you are looking for is NOT in the list"
        })
    }
})

// handles POST requests
router.post("/", (req, res) => {

    // find out if the game is already in our list
    const foundGame = gamesData.find((game) => {
        return game.name === req.body.name.toLowerCase()
    })

    // if the game is NOT in our list
    if (!foundGame) {

        // create a new object using the data from the request body with a generated uuid -- this lets us set the id
        // make sure everything is lowercase for consistent searching and sorting
        const newGame = {
            id: uuid(),
            name: req.body.name.toLowerCase(),
            genres: req.body.genres.map(genre => genre.toLowerCase()),
            releaseYear: req.body.releaseYear,
            platforms: req.body.platforms.map(platform => platform.toLowerCase())
        }

        // add new game to our list of games
        gamesData.push(newGame)

        // send a response
        res.json({
            message: "success",
            messageDetail: `${newGame.name} has been successfully added!`,
            payload: newGame 
        })

    // if the game IS in our list
    } else {

        // send a response
        res.status(500).json({
            message: "failure",
            payload: `${req.body.name} is already in our list so it CANNOT be added`
        })
    }
})

// handles PUT requests
router.put("/:id", (req, res)=> {

    // Determine whether the game we want to update is in our list
    const foundGame = gamesData.find((game)=> {
        return game.id === req.params.id
    })

    // if the game is in our list
    if (foundGame) {

        // create a new object to update the game with that features the properieis the user is giving (other than the ID) -- this prevents the user from updating an id
        const gameToUpdate = {
            name: req.body.name || foundGame.name,
            genres: req.body.genres || foundGame.genres,
            releaseYear: req.body.releaseYear || foundGame.releaseYear,
            platforms: req.body.platforms || foundGame.platforms
        }

        // create a new object with the gameToUpdate information set to lowercase, it might not exist in the initial object so we can't do it there
        const gameToUpdateCased = {
            name: gameToUpdate.name.toLowerCase(),
            genres: gameToUpdate.genres.map(genre => genre.toLowerCase()),
            releaseYear: gameToUpdate.releaseYear,
            platforms: gameToUpdate.platforms.map(platform => platform.toLowerCase())
        }

        // update our game with the new object
        Object.assign(foundGame, gameToUpdateCased)

        // send a response
        res.json({
            message: "success",
            messageDetail: `${foundGame.name} successfully updated!`,
            payload: foundGame
        })

    // else, if the game is NOT in our list
    } else {

        // send a response
        res.status(404).json({
            message: "failure",
            payload: `${req.body.name} is not in our list, CANNOT update!`
        })
    }
})

// handles DELETE requests
router.delete("/:id", (req, res) => {

    // determine whether the game we want to delete is in our list
    const foundGame = gamesData.find((game) => {
        return game.id === req.params.id
    })

    // if the game we want to delete is in our list
    if (foundGame) {

        // create a results array with all the games in our list that do NOT have the id of the game we want to delete
        const results = gamesData.filter((game) => {
            return game.id !== foundGame.id
        })

        // reassign the games array to the results array
        gamesData = results

        // send a response
        res.json({
            message: "success",
            messageDetail: `${foundGame.name} has been successfully deleted!`,
            payload: gamesData
        })

    // else, if the game we want to delete is NOT in our list
    } else {

        // send response
        res.status(404).json({
            message: "failure",
            payload: "The game you want to delete is not in our list, CANNOT delete"
        })
    }
})

module.exports = router