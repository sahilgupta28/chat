const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const io =require('server');



const User = db.User;
const Wallet = db.Wallet;


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    changePassword,
    getUserList,
    getUsersCount,
    createPlayer,
    LoginPlayer
};



async function createPlayer(userParam,req) {

    console.log("UserParams",userParam);

    let response={};

    const vEmailMobile = await User.findOne({unique_id: userParam.unique_id});
    console.log('checkByUniqueId',vEmailMobile);
        if(vEmailMobile){
        return {status:1000,message:'User is already Exist'};
       }
        const user = new User(userParam);
        user.email='Player'+ Math.floor(Date.now())+'@70slots.com';
        user.hash = bcrypt.hashSync("70slots@70slots.com", 10);
        user.mobile = 000000000;
    
        user.role='PLAYER';
        user.create_user_id=req.user.sub;
        // save user
        const result= await user.save();
        console.log("fff",result);
        
    
        if (result) {
            const wallet = new Wallet(userParam);
            wallet.user_id = result.id;
            wallet.create_user_id=req.user.sub;

            const walletResult = await wallet.save();
                if (walletResult) {

                    return {status:200,data:await Wallet.findById(walletResult.id).populate('user_id')};
                    
                }
      }
 
}


async function LoginPlayer(passkey,req) {


    const user = await User.findOne({ unique_id:passkey });
           if (user) {
                const { hash, ...userWithoutHash } = user.toObject();
                const token = jwt.sign({ sub: user.id }, config.secret);
              return {
                 ...userWithoutHash,
                    token
                };
     }
  
}





async function authenticate({ email, password }) {

    const user = await User.findOne({ email });
    if(password){
     if (user && bcrypt.compareSync(password, user.hash)) {
            const { hash, ...userWithoutHash } = user.toObject();
            const token = jwt.sign({ sub: user.id }, config.secret);

            io.io.emit('message',{message:"User is login"} );
            // var mailOptions = {
            //     from: 'abhilash@rvtechnologies.com',
            //     to: 'kshitz@rvtechnologies.com',
            //     subject: 'Sending Email using Node.js',
            //     text: 'That was easy!'
            //   };
              
            //   io.transporter.sendMail(mailOptions, function(error, info){
            //     if (error) {
            //       console.log(error);
            //     } else {
            //       console.log('Email sent: ' + info.response);
            //     }
            //   });

     return {
             ...userWithoutHash,
                token
            };
        }

    } else {

        if (user) {
            const { ...userWithoutHash } = user.toObject();
            const token = jwt.sign({ sub: user.id }, config.secret);
            sendSomething(user.email);

            return {
                ...userWithoutHash,
                token
            };
        }
    }
}

async function changePassword(id,passwordPararm){
    console.log("passwordParam",passwordPararm);
     const user = await User.findById(id);
      if((passwordPararm.oldpassword.length) <=0){
       return { status:1000, message:"Old Password can not be blank"};
      }
     if((passwordPararm.newpassword.length) <=0){
      return { status:1000, message:"New Password can not be blank"};

     }
     if((passwordPararm.confirm_password!=passwordPararm.newpassword)){
        return { status:1000, message:"New Password is not equal to Old Password"};
  
     }
    if (user && bcrypt.compareSync(passwordPararm.oldpassword, user.hash)) {
       user.hash = bcrypt.hashSync(passwordPararm.newpassword, 10);
       const result = await user.save();
       return {status:200,data:result,message:"Password is successfully changed"}
    }else{
        return { status:1000, message:"Wrong Old Password"};
   }
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
async function getAll(page=0,id) {
   var count= await User.find({ _id: { $ne: id } }).count();
   console.log("ccc",count);
   var pageSize=50;
    var users= await User.find({ _id: { $ne: id } }).select('-hash').skip(page*pageSize).limit(pageSize);
   return { status:200, users:users,pageCount:count, pageSize:pageSize,page:page};
}

async function getById(id) {
    console.log("id is",id);
    return await User.findById(id).select('-hash');
}

async function create(userParam,req) {
    console.log("consoleldld",req.file);
    // validate
    const vEmailMobile = await User.findOne({email: userParam.email});

    console.log('1111cccccccccsss');
    console.log(vEmailMobile);

    
    if (vEmailMobile) {
        throw 'User is already exist';

        // const { ...userWithoutHash } = vEmailMobile.toObject();

        //     const token = jwt.sign({ sub: vEmailMobile.id }, config.secret);
        //     return {
        //         ...userWithoutHash,
        //         token
        //     };
        //throw 'email "' + userParam.email + '" is already taken or mobile "'+userParam.mobile+'" is already taken';
    }

     const user = new User(userParam);

     if (req.file && req.file.path) {
         console.log(req.file);
        user.image_file = req.file.path;
        }

    // // hash password
     if (userParam.password) {
         user.hash = bcrypt.hashSync(userParam.password, 10);
     }

     user.create_user_id=req.user.sub;

    // // save user
     const result = await user.save();

     const { hash, ...userWithoutHash } = result.toObject();
     const token = jwt.sign({ sub: result.id }, config.secret);
     return {
         ...userWithoutHash,
         token
     };
}




async function update(id, userParam) {
    //console.log(userParam);
    //return false;
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'email "' + userParam.email + '" is already taken';
    }

    // if (user.mobile !== userParam.mobile && await User.findOne({ mobile: userParam.mobile })) {
    //     throw 'mobile "' + userParam.mobile + '" is already registered';
    // }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    return await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}



async function getUserList(id){


    var users= await User.find({ _id: { $ne: id } }).select('email');
    console.log(users);

    return users;
    
}

async function getUsersCount(){
    
    var distributor_count   =   await User.find({role:"DISTRIBUTOR"}).count();
    var shop_count   =   await User.find({role:"SHOP"}).count();
    
    return {distributor_count, shop_count};

}