let bcrypt = require('bcryptjs');       //npm install --save bcryptjs
let validator = require('validator');   //npm install validator
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { cartItemSchema, CartItems } = require('./cart_item');
const { Product } = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 64,
        unique: true,   //unique is not a validation check
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function () {
                return 'invalid emial format'    //can be a string also 
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    role: {
        type: String,
        required: true,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    cartItems: [cartItemSchema],
    wishlists: [{
        product:{
            required: true,
            type: Schema.Types.ObjectId,
            ref:'Product'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    }]
});

userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(user.password, salt).then((hashed) => {
            user.password = hashed;
            next(); 
        });
    });
});

//instance method
userSchema.methods.shortInfo = function () {
    return {
        _id: this._id,
        username: this.username,
        email: this.email
    };
};

userSchema.methods.generateToken = function (next) {
    let user = this;
    let tokenData = {
        _id: user.id
    };
    let token = jwt.sign(tokenData, 'supersecret');
    user.tokens.push({
        token
    });

    return user.save().then(() => {
        return token;
    });
}


userSchema.statics.findByToken = function (token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }
    return User.findOne({
        '_id': tokenData._id,
        'tokens.token': token
    }).then((user) => {
        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject(user);
        }
    });
};



const User = mongoose.model('User', userSchema);

// let user = new User({userName: 'Ganesh Gaitonde', email: 'gaitonde@gmail.com', password: 'something123'});

// user.save().then((user) => {
//     console.log(user);
// }).catch((err) => {
//     console.log(err);
// });

module.exports = {
    User
}