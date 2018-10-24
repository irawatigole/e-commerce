const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');
const { CartItem } = require('../models/cart_item');
const { validateID } = require('../middlewares/utilities');
const _ = require('lodash');

//index
router.get('/', (req, res) => {
    User.find().then((users) => {
        res.send(users.shortInfo());
    }).catch((err) => {
        res.send(err);
    });
});

//post AKA registration link
router.post('/', (req, res) => {
    let body = _.pick(req.body, ['username', 'password', 'email']);
    let user = new User(body);
    //console.log(user);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send(user.shortInfo());
    }).catch((err) => {
        res.send(err);
    });
});


//logout user
router.delete('/logout', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let token = req.locals.token;
    let activeToken = user.tokens.find(function (inDbToken) {
        return inDbToken.token == token;
    });
    user.tokens.id(activeToken._id).remove();
    user.save().then((user) => {
        res.send();
    }).catch((err) => {
        res.send(err);
    })
});

//nested routes
//list all items
//GET users/cart_items
router.get('/cart_items', authenticateUser, (req, res) => {
    res.send(req.locals.user.cartItems);
});

//add to the cart
// POST users/cart_item
router.post('/cart_items', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let body = _.pick(req.body, ['product', 'quantity']);
    let cartItem = new CartItem(body);
    let inCart = user.cartItems.find(function (item) {
        //if you want to compare 2 object ids you need to use the equals method
        return item.product.equals(cartItem.product);
    });
    if (inCart) {
        inCart.quantity = inCart.quantity + cartItem.quantity;
    } else {
        user.cartItems.push(cartItem);
    }

    user.save().then((user) => {
        res.send({
            cartItem,
            'notice': 'successfully added item to cart'
        })
    }).catch((err) => {
        res.send(err);
    });
});

//update the quantity
//PUT users/cart_items/:cart_item_id
router.put('/cart_items/:id', validateID, authenticateUser, (req, res) => {
    let cartItemId = req.params.id;
    let user = req.locals.user;
    let body = _.pick(req.body, ['quantity']);
    let inCart = user.cartItems.id(cartItemId);
    inCart.quantity = body.quantity;

    user.save().then((user) => {
        res.send({
            cartItem: inCart,
            notice: "successfully updated quantity"
        });
    }).catch((err) => {
        res.send(err);
    });
});

//delete
//DELETE users/cart_items/:id
router.delete('/cart_items/:id', validateID, authenticateUser, (req, res) => {
    let user = req.locals.user;
    let cartItemId = req.locals.id;
    user.cartItems.id(cartItemId).remove();
    user.save().then((user) => {
        res.send('successfully removed the product from the cart');
    }).catch((err) => {
        res.send(err);
    });
});

//empty

//create a wish list
//POST users/wishlists
router.post('/wishlists', authenticateUser, (req, res) => {
    let user = req.locals.user;
    let wishItem = _.pick(req.body, ['product', 'createdAt', 'isPublic']);
    user.wishlists.push(wishItem);
    let inWishlist = user.wishlists.find(function (item) {
        return item.product.equals(wishItem.product);
    });
    if (inWishlist) {
        res.send({
            notice: 'item has already been added.'
        })
    } else {
        user.wishlists.push(wishItem);
    }
    user.save().then((user) => {
        res.send({
            wishlists: user.wishlists,
            notice: "successfully added to wishlist"
        })
    }).catch((err) => {
        res.send(err);
    });
});


//DELETE users/wishlists/:id
router.delete('/wishlists/:id', validateID,
    authenticateUser, (req, res) => {
        let user = req.locals.user;
        let wishItemId = req.params.id;
        user.wishlists.id(wishItemId).remove();
        user.save().then((user) => {
            res.send('successfully removed from wishlist');
        }).catch((err) => {
            res.send(err);
        });
    });

router.get('/:username/wishlists', authenticateUser, (req, res) => {
    let userName = req.params.username;
    User.findOne({ username: userName, 'wishlists.isPublic': true }).then((user) => {
        if (!user) {
            res.send({
                notice: 'this is a private profile'
            })
        }
        res.send({
            wishlists: user.wishlists
        });
    });
});


module.exports = {
    usersController: router
}