const express = require('express')
const router = express.Router();
const { checkuserdetail, insertuserdetail, getuserdetail } = require('./../Controllers/LoginPage/LoginPage');
const { getbookingdetail ,bookseats,resetbookingdetail} = require('./../Controllers/Dashboard/BookingDashboard')
router.get('/getuserdetail', getuserdetail);
router.get('/getbookingdetail', getbookingdetail);
router.get('/resetbookingdetail', resetbookingdetail);
router.get('/checkuserdetail/:username/:password', checkuserdetail);
router.post('/insertuserdetail', insertuserdetail);
router.post('/bookseats', bookseats);
module.exports = { router }