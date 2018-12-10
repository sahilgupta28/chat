const express = require('express');
const router = express.Router();
const userService = require('./../users/user.service');

const walletService = require('./wallet.service');
 
// routes
router.get('/user-list', getUserList);

router.post('/create', create);
router.get('/index/:page', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/:id', update);
router.delete('/:id', _delete);


module.exports = router;



function create(req, res, next) {

    walletService.create(req.body,req.user.sub)
        .then(user => user ? res.status(200).json({status:200,data: user}) : {})
        .catch(err => next(err));
}

function getAll(req, res, next) {
    walletService.getAll(req.query.page)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    walletService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {

    walletService.getById(req.params.id)
        .then(user => user ? res.json({status:200,data: user}) : res.status(404).json({status:1,message:'No record'}))
        .catch(err => { 
                        if (err.message.indexOf('Cast to ObjectId failed') !== -1)
                            return res.status(501).json({status:1,message: "Data was not found!"});

                            return res.status(501).json({status:1,message:err.message});
                        
        });
}

function update(req, res, next) {
    //console.log(req.body);
    //return false;
    walletService.update(req.params.id, req.body,req.user.sub)
        .then(user => user ? res.status(200).json({status:0,data: user}) : {})
        .catch(err => next(err));
}

function _delete(req, res, next) {
    walletService.delete(req.params.id)
        .then(() => res.json({status:200,data:'User has been deleted successfully.'}))
        .catch(err => next(err));
}



function getUserList(req, res, next) {
    userService.getUserList(req.user.sub)
        .then(users => users ? res.status(200).json({status:200,data: users}) : {})
        .catch(err => next(err));
}