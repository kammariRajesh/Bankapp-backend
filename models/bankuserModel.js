const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    account: {
      type: String,
      required: true
    },
    bank:{
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    balance: {
      type:String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    }
},
{timestamps:true})

const BankUser = mongoose.model('BankUser', userSchema);

module.exports = BankUser