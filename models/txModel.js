const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BankUser",
    },
    account: {
      type: String,
      required: true
    },
    type:{
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    amount: {
      type:String,
      required: true
    },
    balance: {
      type: String,
      required: true
    }
},
{timestamps:true})

const Tx = mongoose.model('Tx', userSchema);

module.exports = Tx;