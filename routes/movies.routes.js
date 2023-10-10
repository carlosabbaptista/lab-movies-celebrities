// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here
router.get("/movies/create", (req, res) => {
    // Fetch the list of celebrities from the database
    Celebrity.find()
        .then((celebrities) => {
            res.render("movies/new-movie", { celebrities });
        })
        .catch((err) => {
            console.error(err);
        });
});


router.post("/movies/create", (req, res) => {
    const { title, genre, plot, cast } = req.body;

    // Ensure that the "cast" value is an array
    const castArray = Array.isArray(cast) ? cast : [cast];

    const newMovie = new Movie({
        title,
        genre,
        plot,
        cast: castArray,
    });

    newMovie
        .save()
        .then(() => {
            res.redirect("/movies");
        })
        .catch((err) => {
            console.error(err);
            // Render the form page with an error message
            res.render("movies/new-movie", { celebrities: castArray, error: err });
        });
});


router.get("/movies", (req, res) => {
    // Fetch all movies from the database
    Movie.find()
        .populate("cast") // Populate the cast field with celebrity data
        .then((movies) => {
            res.render("movies/movies", { movies });
        })
        .catch((err) => {
            console.error(err);
        });
});


router.get("/movies/:id", (req, res) => {
    const movieId = req.params.id;

    Movie.findById(movieId)
        .populate("cast") // Populate the cast field with celebrity data
        .then((movie) => {
            if (!movie) {
                return res.status(404).render("not-found");
            }
            res.render("movies/movie-details", { movie });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).render("error");
        });
});


router.post("/movies/:id/delete", (req, res) => {
    const movieId = req.params.id;

    // Use findByIdAndRemove to delete the specific movie
    Movie.findByIdAndRemove(movieId)
        .then(() => {
            res.redirect("/movies"); // Redirect to the list of movies
        })
        .catch((err) => {
            console.error(err);
            res.status(500).render("error");
        });
});


router.get("/movies/:id/edit", (req, res) => {
    const movieId = req.params.id;

    // Use findOne to retrieve the specific movie by its ID
    Movie.findOne({ _id: movieId })
        .populate("cast") // Populate the cast field to access celebrity data
        .then((movie) => {
            if (!movie) {
                return res.render("not-found");
            }
    
            // Retrieve all celebrities
            Celebrity.find()
                .then((celebrities) => {
                    res.render("movies/edit-movie", { movie, celebrities });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).render("error");
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).render("error");
        });
});


router.post("/movies/:id", (req, res) => {
    const movieId = req.params.id;

    // Create an object with updated movie data from the form
    const updatedMovie = {
        title: req.body.title,
        genre: req.body.genre,
        plot: req.body.plot,
        cast: req.body.cast, // Cast will be an array of celebrity IDs
    };

    // Use findByIdAndUpdate to update the specific movie by its ID
    Movie.findByIdAndUpdate(movieId, updatedMovie, { new: true }) // { new: true } returns the updated document
        .then((movie) => {
            if (!movie) {
            return res.render("not-found");
            }
            res.redirect(`/movies/${movie._id}`); // Redirect to the movie details page
        })
        .catch((err) => {
            console.error(err);
            res.status(500).render("error");
        });
});


module.exports = router;