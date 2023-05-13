const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "BankUser",
    },
    type:{
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

const Txlist = mongoose.model('Txlist', userSchema);

module.exports = Txlist;