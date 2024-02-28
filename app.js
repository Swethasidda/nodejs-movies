const express = require('express')
const app = express()
const path = require('path')
const dbpath = path.join(__dirname, 'moviesData.db')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
//INTILIZATION OF DB AND SERVERS
const intializationDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000')
    })
  } catch (e) {
    console.log(`DB ERROR ${e.message}`)
    process.exit(1)
  }
}
intializationDBAndServer()
app.use(express.json())
//AP1
app.get('/movies/', async (request, response) => {
  const getmovies = `
    SELECT *
    FROM  movie;
    `
  const movies = await db.all(getmovies)
  const result = movies => {
    return {
      movieName: movies.movie_name,
    }
  }
  response.send(movies.map(each => result(each)))
})
//AP2
app.post('/movies/', async (request, response) => {
  const bodydetails = request.body
  const {directorId, movieName, leadActor} = bodydetails
  const addquery = `
    INSERT INTO movie (director_id,movie_name,lead_actor)
    VALUES(
        '${directorId}',
        '${movieName}',
        '${leadActor}'
    );
    `
  await db.run(addquery)
  response.send('Movie Successfully Added')
})
//AP3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmoive = `
  SELECT *
  FROM movie 
  WHERE movie_id = ${movieId};
  `
  const movie = await db.get(getmoive)
  response.send({
    movieId: movie.movie_id,
    directorId: movie.director_id,
    movieName: movie.movie_name,
    leadActor: movie.lead_actor,
  })
})
//API 4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const bodydetails = request.body
  const {directorId, movieName, leadActor} = bodydetails
  const updatedetails = `
  UPDATE movie 
  SET
  director_id = '${directorId}',
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE movie_id = ${movieId};
  `
  await db.run(updatedetails)
  response.send('Movie Details Updated')
})
//API 5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletequery = `
  DELETE FROM movie
  WHERE movie_id = ${movieId};
  `
  await db.run(deletequery)
  response.send('Movie Removed')
})
//API 6
app.get('/directors/', async (request, response) => {
  const directorquery = `
  SELECT *
  FROM director;`
  const directors = await db.all(directorquery)
  const result = directors => {
    return {
      directorId: directors.director_id,
      directorName: directors.director_name,
    }
  }
  response.send(directors.map(each => result(each)))
})
//API 7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const directorMoviesQuery = `
  SELECT *
  FROM movie 
  WHERE director_id = ${directorId}; 
  `
  const directormovies = await db.all(directorMoviesQuery)
  const result = directormovies => {
    return {
      movieName: directormovies.movie_name,
    }
  }
  response.send(directormovies.map(each => result(each)))
})
module.exports = app
