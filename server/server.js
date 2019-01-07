require('./config/config');

const _ = require('lodash');
let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Product} = require('./models/product');
let {Category} = require('./models/category');

let app = express();
let port = process.env.PORT;

app.use(bodyParser.json());

app.post('/category', (req, res) => {
    let category = new Category({
        id: req.body.id,
        name: req.body.name,
        childCategories: req.body.childCategories,
        addedAt: Date.now(),
    });

    category.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/categories', (req, res) => {
    Category.find().then((categories) => {
        res.send({ categories });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/category/:id', (req, res) => {
    let id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Category.findById(id).then((category) => {
        if (!category) {
            return res.status(404).send();
        }

        res.send({category});
    }, (err) => {
        res.status(400).send();
    });
});

app.post('/product', (req, res) => {
    let product = new Product({
        category: req.body.category,
        name: req.body.name,
        price: req.body.price,
        addedAt: Date.now(),
    });

    product.save().then((result) => {
        res.send(result);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/products/:categoryId', (req, res) => {
    let categoryId = req.params.categoryId;

    if (!ObjectID.isValid(categoryId)) {
        return res.status(404).send();
    }

    Product.find({category: categoryId}).then((product) => {
        if (!product) {
            return res.status(404).send();
        }

        res.send({product});
    }, (err) => {
        res.status(400).send();
    });
});

app.patch('/product/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'price', 'category']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Product.findByIdAndUpdate(id, {$set: body}, {new: true}).then((product) => {
        res.send(product);
        if (!product) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});

module.exports = {app};
