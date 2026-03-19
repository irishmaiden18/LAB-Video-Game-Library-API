# LAB-Video-Game-Library-API

In this lab, you'll build a basic Express API to serve a collection of video game data. The data is provided as two JSON files:

- `games.js` — an array of video game objects.
- `platforms.js` — an array of platform objects.

## Setup

1. DONE -- Install dependencies: Setup your project using `npm init -y` and install dependencies for `express`, `morgan`, `lodash`, and `uuid`

2. DONE -- Set up your Express app to listen to requests and as your routes as you complete them.

4. DONE -- The required routes are defined below.  Use Postman to test your routes as you write them.

5. DONE -- Your app should filter and sort utilizing query parameters

---

## Routes

Your API should have a router for Games and a separate route for Platforms.  The following routes are required to implement

### `/api/games`

-DONE-- `GET /api/games`

  - Returns a list of all games.

-DONE-- `GET /api/games/:id`

  - Returns a single game by its UUID.

-DONE-- `POST /api/games`

  - Adds a new game to the collection.
  - Expects a request body like this:
    ```json
    {
      "name": "Game Title",
      "releaseYear": 2025,
      "genres": ["Action", "Adventure"],
      "platforms": ["Switch", "PC"]
    }
    ```
  - A new UUID should be generated for each new game.

-DONE-- `PUT /api/games/:id`

  - Updates an existing game for its given properties (except ID!)
  - Accepts any subset of fields from the POST format.

-DONE-- `DELETE /api/games/:id`

  - Deletes the game with the given ID.

### `/api/platforms`

-DONE-- `GET /api/platforms`

  - Returns a list of all platforms.

-DONE-- `GET /api/platforms/:id`

  - Returns a single platform by its ID.

---

## Filtering and Sorting

Your application should support filtering and sorting of game and platform data through query parameters on the API endpoints.

-DONE-- ***For filtering, you only need to be able to filter by one property at a time. Figuring out how to do multiple would be a BONUS GOAL

## Games Endpoint: `GET /api/games`

This endpoint returns a list of games. It accepts the following **optional** query parameters to filter and sort the results:

-DONE-- **`platform`**  
  Filters games by the platform name. Only games available on the specified platform will be returned.  
  *Example:* `?platform=Nintendo Switch` returns games released for the Nintendo Switch.

-DONE-- **`genre`**  
  Filters games by genre. Only games that belong to the specified genre will be included.  
  *Example:* `?genre=RPG` returns games categorized as role-playing games.

-DONE-- **`year`**  
  Filters games by release year. Only games released in the specified year will be returned.  
  *Example:* `?year=2025` returns games released in the year 2025.

-DONE-- **`sortBy`**  
  Specifies the field to sort the results by. Supported fields are:  
  - `name` — Sorts games alphabetically by their title.  
  - `releaseYear` — Sorts games by their release year.

-DONE-- **`order`**  
  Specifies the sort direction. Must be used together with the `sortBy` parameter.  
  - `asc` — Sorts in ascending order (A-Z or oldest to newest).  
  - `desc` — Sorts in descending order (Z-A or newest to oldest).

-DONE--**Default sorting:** If no `sortBy` parameter is provided, games should be sorted alphabetically by `name` in ascending order.

**Example requests:**

- `GET /api/games?platform=PC&sortBy=releaseYear&order=desc`  
  Returns PC games sorted by release year from newest to oldest.

- `GET /api/games?genre=RPG`  
  Returns all RPG games sorted alphabetically by title.

---

## Platforms Endpoint: `GET /api/platforms`

This endpoint returns a list of available platforms. It accepts the following optional query parameter:

-DONE-- **`sortBy`**  
  Specifies the field to sort platforms by. Supported fields are:  
  - `name` — Sorts platforms alphabetically by their name.  
  - `releaseYear` — Sorts platforms by their release year.

-DONE-- **Default sorting:** If no `sortBy` parameter is provided, games should be sorted alphabetically by `name` in ascending order.

**Example requests:**

- `GET /api/platforms?sortBy=name`  
  Returns platforms sorted alphabetically.

- `GET /api/platforms?sortBy=releaseYear`  
  Returns platforms sorted by release year from oldest to newest.

-DONE-- **Default sorting:** If no `sortBy` parameter is provided, games should be sorted alphabetically by `name` in ascending order.

## Bonus Goals

1. DONE-- **Add Pagination**  
   Implement pagination for the `/api/games` endpoint using query parameters like `page` and `limit` to return a subset of results per request.

2. DONE-- **Case-Insensitive Filtering and Sorting**  
   Make all filtering and sorting on games and platforms case-insensitive for a better user experience.
