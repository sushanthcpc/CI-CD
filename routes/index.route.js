const express = require('express');
const router = express.Router();
const newController = require('../controllers/new.controller');
const postDataDB = require('../utils/create.util');

const { Pool } = require('pg');
const { pgSqlConfig, USER_MESSAGE } = require('../config/app.config');
const pool = new Pool(pgSqlConfig)

router.post('/greet', newController.greet)

router.post('/tunnel', newController.tunnel)

router.post('/bulk', newController.bulkpost)

router.post('/create', async (req, res) => {
    // const createRec = (request, response) => {
    // let { DATE, SB, CA, ODD, Dep, Adv } = req.body

    //     // const {
    //     //     name,
    //     //     email
    //     // } = request.body
    //     pool.query('INSERT INTO bfsd.bfsd (datee, sb, ca, odd, dep, adv) VALUES ($1, $2, $3, $4, $5, $6)', [DATE, SB, CA, ODD, Dep, Adv], (error, results) => {
    //         if (error) {
    //             throw error
    //         }
    //         response.status(201).send(`User added with ID: ${results}`)
    //     })
    // }
    // createRec(req, res)
    // res.send('Post Data')
    const results = await postDataDB(req.body)
    console.log(results)
    // results.then(res => console.log(res))
    // res.status(201).send(`BFSD_Record added for DATE: ${results}`)
})

router.get('/', (req, res) => {
    res.send('K-Bank')
})

module.exports = router;