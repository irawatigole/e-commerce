const express = require('express');
const { Product } = require('../models/product');
const { validateID } = require('../middlewares/utilities');
const router = express.Router();
const {authenticateUser} = require('../middlewares/authentication');

//index
router.get('/', (req, res) => {
    Product.find().then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});

//find by id
router.get('/:id', validateID, authenticateUser, (req, res) => {
    let id = req.params.id;
    Product.findById(id).populate('category', 'name').then((product) => {
        res.send(product);
    }).catch((err) => {
        res.send(err);
    });
});

//delete
router.delete('/:id', validateID, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndRemove(id).then((product) => {
        if (product) {
            res.send(product);
        } else {
            res.send({ notice: 'product not found' })
        }
    }).catch((err) => {
        res.send(err);
    });
});

//update
router.put('/:id', validateID, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, runValidators: true }).then((product) => {
        if (!product) {
            res.send({
                notice: 'product not found'
            })
        }
        res.send({
            product,
            notice: 'Successfully updated the product'
        });
    });
});

//post
router.post('/', (req, res) => {
    let body = req.body;
    let product = new Product(body);
    product.save().then((product) => {
        res.send({
            product,
            notice: 'successfully created the product'
        })
    }).catch((err) => {
        res.send(err);
    });
});

//show
router.get('/:id/products', validateID, (req, res) => {
    let id = req.params.id;
    Product.findById(id).then((product) => {
        res.send(product);
    }).catch((err) => {
        res.send(err);
    });
});


//to find products between two values
router.get('/price/value', (req, res) => {
     if(req.query.low && req.query.high){
        Product.where('price').gte(parseInt(req.query.high)).lte(parseInt(req.query.low)).then((products) => {
            res.send(products)
        })
    }else if(req.query.low){
        Product.where('price').lte(parseInt(req.query.low)).then((products) => {
            res.send(products)
        })
    }else if(req.query.high){
        Product.where('price').gte(parseInt(req.query.high)).then((products) => {
            res.send(products)
        })
    }
})




module.exports = {
    productsController: router
}