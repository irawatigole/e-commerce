//middlewares
const { ObjectID } = require('mongodb');


const validateID = function (req, res, next) {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.send({
            notice: 'invalid object id'
        });
    } else {
        next();
    }   
};

module.exports = {
    validateID
};