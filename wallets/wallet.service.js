const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const io = require('server');




const Wallet = db.Wallet;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
async function getAll(page=0) {

    
   var count= await Wallet.count();
   var pageSize=50;

   var wallets= await Wallet.find()
   .populate('user_id').skip(page*pageSize).limit(pageSize);
   
  return { status:200, wallets:wallets,pageCount:count, pageSize:pageSize,page:page};
}

async function getById(id) {
    return await Wallet.findById(id).populate('user_id');
}

async function create(userParam,login_id) {

    const wallet= await Wallet.findOne({user_id:userParam.user_id.value});

       if(wallet){
           wallet.status=userParam.status;
           wallet.user_id=userParam.user_id.value;
           wallet.create_user_id=login_id;
           wallet.amount=parseFloat(userParam.amount)+parseFloat(wallet.amount);
           wallet.save();
           return wallet;
       }

       const wallet_new=new Wallet(userParam);
       wallet_new.status=userParam.status;
       wallet_new.user_id=userParam.user_id.value;
       wallet_new.create_user_id=login_id;
       wallet_new.amount=userParam.amount;
       wallet_new.save();
       return wallet_new;
     

}

async function update(id, userParam,login_id) {
    //console.log(userParam);
    //return false;
    const wallet = await Wallet.findById(id);

    // validate
    if (!wallet) throw 'User not found';
   
    // copy userParam properties to user
    //Object.assign(user, userParam);

    wallet.status=userParam.status;
    wallet.user_id=userParam.user_id.value;
    wallet.create_user_id=login_id;
    wallet.amount=parseFloat(userParam.amount);
    return await wallet.save();
}

async function _delete(id) {
    await Wallet.findByIdAndRemove(id);
}