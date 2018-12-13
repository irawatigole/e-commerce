const express = require('express');
const router = express.Router();
const { Category } = require('../models/category');
const { validateID } = require('../middlewares/utilities');
const { Product } = require('../models/product');

const { authenticateUser, authorizeUser } = require('../middlewares/authentication');

// localhost:3000/categories
router.get('/', (req, res) => {
    Category.find().then((categories) => {
        res.send(categories);
    }).catch((err) => {
        res.send(err);
    });
});

// localhost:3000/categories/:id 
router.get('/:id', validateID, (req, res) => {
    let id = req.params.id;
    Category.findById(id).then((category) => {
        res.send(category);
    });
});

//post
router.post('/', authenticateUser, authorizeUser, (req, res) => {
    let body = req.body;
    let category = new Category(body);
    category.save().then((category) => {
        res.send({
            category,
            notice: 'successfully created the category'
        })
    }).catch((err) => {
        res.send(err);
    });
});


//delete by id
router.delete('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id).then((category) => {
        if (category) {
            res.send(category);
        } else {
            res.send({
                notice: 'category not found'
            })
        }
    }).catch((err) => {
        res.send(err);
    });
});

//update by id
router.put('/:id', validateID, authenticateUser, authorizeUser, (req, res) => {  //model level method provided by mongoose
    let id = req.params.id;
    let body = req.body;
    Category.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, runValidators: true }).then((category) => {
        if (!category) {
            res.send({
                notice: 'category not found'
            })
        }
        res.send({
            category,
            notice: 'Successfully updated the category'
        });
    });
});

//show all products belonging to category model
router.get('/:id/products', validateID, (req, res) => {
    let id = req.params.id;
    Product.find({category: id}).then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });

    // All the user defined methods are defined at schema level not at model level
    // Populate method is used to return only the required fields from a different object
    Product.findByCategory(id).then((products) => { 
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});

router.get('/:id/products/price/value', validateID, (req, res) => {
    let id = req.params.id;
    Product.find({category: id}).then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });

    // All the user defined methods are defined at schema level not at model level
    // Populate method is used to return only the required fields from a different object
    Product.findByCategoryAndRange(id).where('price').gte(parseInt(req.query.low)).then((products) => { 
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = {
    categoriesController: router
}