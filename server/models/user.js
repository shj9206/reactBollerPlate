const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt =  require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        uniqyue : 1
    },
    password:{
        type : String,
        minlength : 5
    },
    lastname:{
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    token : {
        type : String,
    },
    tokenExp:{
        type : Number
    }
});


//save 함수를 실행하기전 처리
userSchema.pre('save',function(next){
    var user= this;

    if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash
            next()
            // Store hash in your password DB.
        });
    });
} else {
    next()
};

});


//password가 맞는지 확인
userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

//token 생성
userSchema.methods.generateToken=function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secret');

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;

    jwt.verify(token,'secret',function(err, decode){
        user.findOne({"_id": decode, "token":token}, function(err,user){
            if(err)return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}