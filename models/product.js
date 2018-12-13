const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'              //allows to attach a category to a product
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 64
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    codEligible: {
        type: Boolean,
        required: true,
        default: true
    },
    maxUnitPurchase: {
        type: Number,
        required: true,
        min: 1
    },
    lowStockAlert: {
        type: Number,
        required: true,
        min: 0
    }
});

//all the user defined methods are defined at schema level, not at model level
productSchema.statics.findByCategory = function (id) { //dont use es6 function because 'this' will not be bound
    let Product = this;     //this referrs to the product on which find by category method will be called
    return Product.find({ category: id });
}

productSchema.statics.findByCategoryAndRange = function (id) { 
    let Product = this;     
    return Product.find({ category: id });
}



const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product
}