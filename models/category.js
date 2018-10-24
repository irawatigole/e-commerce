//const { mongoose } = require('../../config/db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true //server side validation
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category
};



//these methods are at the data base level and will not work from the front end
//create a new category
// let category = new Category({name: 'furniture'});
//     category.save().then((category) => {     //object level method provided by mongoose
//         console.log(category);
//     }).catch((err) => {
//         console.log(err);
//     });

//find category of an id
// Category.findById('5ba2042568672b2054cc772d').then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// })

//find all categories by name
// Category.find({ name: 'electronics' }).then((categories) => {
//     console.log(categories);
// }).catch((err) => {
//     console.log(err);
// });

//update a category's name
//2 step process, find and update

// Category.findByIdAndUpdate({_id:'5ba2042568672b2054cc772d'},{$set: {name: 'technology'}},
// {new: true})
// .then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });


//listing all the categories by name
// Category.find().then((categories) => {
// console.log('listing all', categories.length);
// categories.forEach((kind) => {
//    console.log( kind.name ); 
// })
// });

// Category.findByIdAndUpdate({_id:'5ba2042568672b2054cc772d'},{$set: {name: 'groceries'}},
// {new: true , runValidators: true}) // runValidators ensures that 'name' is not null while updating the value
// .then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });

// Category.findByIdAndRemove({_id:'5ba229017abf0d1a9895c56c'}).then((category) => {
//     console.log(category);
// }).catch((err) => {
//     console.log(err);
// });









