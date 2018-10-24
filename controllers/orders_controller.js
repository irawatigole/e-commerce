const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { authenticateUser } = require('../middlewares/authentication');

// /orders- he gets to see all his orders
router.get('/', authenticateUser, (req, res) => {
    let user = req.locals.user;
    Order.find({ user: user._id }).then((orders) => {   //find the user who has placed an order based on the id of that                                                         user and return all the orders he placed
        res.send(orders);
    }).catch((err) => {
        res.send(err);
    });
});

//create order
router.post('/', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let order = new Order();
    order.user = user._id;                  //assign the id of the user to user field in the order schema and this is the                                           populate method
    order.save().then((order) => {
        res.send(order);
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = {
    ordersController: router
}