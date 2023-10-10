// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here
router.get('/celebrities/create', (req, res) => {
    res.render('celebrities/new-celebrity');
});

router.post('/celebrities/create', (req, res) => {
    const { name, occupation, catchPhrase } = req.body;

    // Create a new Celebrity instance
    const newCelebrity = new Celebrity({
        name,
        occupation,
        catchPhrase,
    });

    // Save the new celebrity to the database
    newCelebrity.save((err) => {
        if (err) {
            res.render('celebrities/new-celebrity', { error: 'An error occurred. Please try again.' });
        } else {
            // Redirect to the list of celebrities
            res.redirect('/celebrities');
        }
    });
});


router.get('/celebrities', (req, res) => {
    // Retrieve all celebrities from the database
    Celebrity.find()
        .then((celebrities) => {
            // Render the celebrities view and pass the array of celebrities
            res.render('celebrities/celebrities', { celebrities });
        })
        .catch((err) => {
            // Handle errors
            console.error(err);
            res.status(500).send('An error occurred');
        });
});

module.exports = router;