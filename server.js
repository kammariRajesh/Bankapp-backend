const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Tx = require('./models/txModel');
const BankUser = require('./models/bankuserModel');
const Txlist = require('./models/txlistModel');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();

// MIDDLEWARES
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json({extended:false}));




// DATABASE CONNECTION
const connectDb = async () => {
  try {
    const connect = await mongoose.connect("mongodb://localhost:27017/mydb",{
      useNewUrlParser:true,
      useUnifiedTopology:true
    });
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectDb();




// CONNECTING FRONTEND AND BACKEND
const corsOptions = {
  origin: '*', // specify the origin domain
};
app.use(cors(corsOptions));




// ROUTES
app.post('/register',async (req, res) => {

  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    await BankUser.create({
      name: req.body.name,
      email: req.body.email,
      account: req.body.account,
      bank: req.body.bank,
      status: req.body.status,
      balance: req.body.balance,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });
    res.json({
      message: "User Registered Successfully"
    })

  }catch(err){
    res.json({
      message: "Email already Registred"
    })
  }
})

app.post('/login',async (req, res) => {

  try{
    const loginDetails = req.body;
    const exist = await BankUser.findOne({
      email: loginDetails.email
    })
    if(exist){
      if(await bcrypt.compare(loginDetails.password,exist.password)){
          let payload = {
            user:{
                id : exist._id
                }
          }
          jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
            (err,token) =>{
                if (err) throw err;
                return res.json({token,message:"User Logged In Successfully"})
            }  
            )
      }else{
            res.json({
              message: "Incorrect Password"
            })
      }
    }else{
          res.json({
            message: "User Not Registred"
          })
    }

  }catch(err){
    res.json({
      message: "User Not Registred"
    })
  }
})


app.get('/myprofile',middleware,async(req, res)=>{
  try{
      let user = await BankUser.findById(req.user.id);
      if(!user){
          return res.status(400).send('User not found');
      }
      res.json(user);
  }
  catch(err){
    res.json({
      message: "Server Error"
    })
  }
})

app.post('/addtx',middleware,async (req, res) => {
  try{
      let exist = await BankUser.findById(req.user.id);
      if(!exist){
          return res.status(400).send('User not found');
      }
      // console.log(exist);
    const newTX = await new Tx({
      account: req.body.account,
      type: req.body.type,
      mode: req.body.mode,
      amount: req.body.amount,
      balance: req.body.balance,
      user_id: req.user.id,
    });
    await newTX.save();
    res.json({
      newTX,
      message: "Transaction Completed" 
    });

  }catch(err){
    res.json({
      message: "Server Error" 
    })
    console.log(err);
  }
})

app.post('/addtxlist',middleware,async (req, res) => {
  try{
      let exist = await BankUser.findById(req.user.id);
      if(!exist){
          return res.status(400).send('User not found');
      }
      // console.log(exist);
    const newtxList = await new Txlist({
      type: req.body.type,
      amount: req.body.amount,
      balance: req.body.balance,
      user_id: req.user.id,
    });
    await newtxList.save();
    res.json({
      newtxList,
      message: "Transaction Completed" 
    });

  }catch(err){
    res.json({
      message: "Server Error" 
    })
    console.log(err);
  }
})

// app.get('/BankUsers',middleware,async (req, res) => {
//   try{
//     const BankUsers = await BankUser.find({user_id:req.user.id});
//     res.json(BankUsers);
//   }catch(e){
//     console.log(e);
//   }
// })

app.get('/getbalance',middleware,async (req, res) => {
  try{
    let exist = await BankUser.findById(req.user.id);
    res.json(exist);
  }catch(e){
    console.log(e);
  }
})

app.put('/updatebalance',middleware,async (req, res) => {
  try{
    let exist = await BankUser.findById(req.user.id);
    exist.balance = req.body.balance;
    await exist.save();
    res.json(exist.balance);
  }catch(e){
    console.log(e);
  }
})

app.get('/gettxs',middleware,async (req, res) => {
  try{
    let list = await Txlist.find({user_id:req.user.id});
    res.json(list);
  }catch(e){
    console.log(e);
  }
})

// app.put('/BankUsers/:id',middleware,async (req, res) => {
//   try{
//     const BankUser = await BankUser.findByIdAndUpdate(req.params.id,{
//       name: req.body.BankUserName,
//       image: req.body.BankUserImage,
//       description: req.body.BankUserDescription,
//       BankUserLink: req.body.BankUserLink
//     })
//     res.json({
//       message: "BankUser Updated" 
//     });
//   }catch(e){
//     console.log(e);
//   }
// })



// SERVER START
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server running on http://localhost:5000")
})
