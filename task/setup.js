require('../../config/db');
const faker = require('faker');
const { Product } = require('../models/product');
const { Category } = require('../models/category');

for(let i = 0; i < 10; i++) {
    let name = faker.commerce.department()
    let category = new Category({ name })
    category.save().then((category) => {
        console.log(category)
    })
}

Category.find().then((categories) => {
    let category = categories[faker.random.number(categories.length)]
    console.log(category)
})

for (let i = 0; i < 100; i++) {
    Category.find().then((categories) => {
        let name = faker.commerce.productName()
        let price = faker.commerce.price()
        let description = faker.lorem.paragraph()
        let stock = faker.random.number(100)
        let category  
        category = categories[faker.random.number(categories.length)]
        let maxUnitPurchase = faker.random.number(5)
        let codEligible = faker.random.boolean()
        let lowStockAlert = 40
        const product = {
            name,
            price,
            description,
            stock,
            maxUnitPurchase,
            codEligible,
            lowStockAlert,
            category: category._id
        }

        let p = new Product(product)
        return p.save()

    }).then((product) => {
        console.log(product)
    }).catch((err) => {
        console.log(err) 
    })
}