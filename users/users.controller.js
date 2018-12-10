const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const io =require('server');
const multer = require('multer')

var storage = multer.diskStorage({ 
       destination: (req, file, cb) => { 
           console.log('image upload func',file)
      cb(null, './uploads')
        },
     filename: (req, file, cb) => {
         console.log('file rename')
      cb(null, file.fieldname + '_' + Date.now())
           }
   });
 var upload = multer({storage: storage});
// routes
router.post('/authenticate', authenticate);
router.post('/register',upload.single('image_file'),register);
router.post('/change-password', changePassword);
router.post('/create-player', createPlayer);
router.post('/create-player', LoginPlayer);


router.get('/dashboard-items-count', getDashboardItemsCount);
router.get('/index/:page', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/:id', update);
router.delete('/delete/:id', _delete);


module.exports = router;


function authenticate(req, res, next) {
        userService.authenticate(req.body)
       .then(user => user ? res.status(200).json({status:200,data: user}) : res.status(400).json({status:1,message: 'mobile or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    console.log('req body',req.body);
   userService.create(req.body,req)
        .then(user => user ? res.status(200).json({status:200,data: user}) : {})
        .catch(err => next(err));
}

function createPlayer(req,res,next){

    console.log("req body",req.body);
    userService.createPlayer(req.body,req)
    .then(user => user ? res.status(200).json({status:user.status,data: user}) : {})
    .catch(err => next(err));
}



function LoginPlayer(req,res,next){

    console.log("req body",req.body);
    userService.createPlayer(req.body,req)
    .then(user => user ? res.status(200).json({status:user.status,data: user}) : {})
    .catch(err => next(err));
}




function getAll(req, res, next) {

    console.log("new value",req.user.sub);
    
   userService.getAll(req.query.page,req.user.sub)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function changePassword(req, res, next){
    userService.changePassword(req.user.sub,req.body).
    then(users => res.json(users))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
    console.log("Cureent User");
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {

    console.log("request",req.params);
      var id;
    if(req.params.id=='profile'){
      id=req.user.sub;
      }else{
      id= req.params.id;
    }

    userService.getById(id)
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

    if(req.params.id=='profile'){
        id=req.user.sub;
        }else{
        id= req.params.id;
      }
    userService.update(id, req.body)
        .then(user => user ? res.status(200).json({status:0,data: user}) : {})
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({status:200,data:'User has been deleted successfully.'}))
        .catch(err => next(err));
}

function getDashboardItemsCount(req, res, next){
    userService.getUsersCount()
    .then(count => count ? res.status(200).json({status:200,data: count}) : {})
        .catch(err => next(err));
}
