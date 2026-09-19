const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {Sequelize, DataTypes} = require('sequelize')
app.use(express.json());


const sequelize = new Sequelize(
   PostgreSQL_URL,
    {
        dialect : 'postgres',
        logging:false,
        pool:false,
    }
);

const User = sequelize.define('User',{
    id:{type:DataTypes.INTEGER,PrimaryKey:true},
    first_name:{type:DataTypes.STRING},
    last_name:{type:DataTypes.STRING},
    email:{type:DataTypes.STRING, allowNull:false},
    password:{type:DataTypes.STRING, allowNull:false},
    mobile_number:{type:DataTypes.INTEGER},
})

// function middleware(req,res,next){
//     if(req.header){
//         next();
//     }
// }
const token = (req,res,next) => {
const header = req.header['authorazation']
const token = header && header.split(' ')[1];
jw.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
    if(err){
        return res.status(403).json({message :'invalid token'});

    }
    req.user = decoded;
    next();
})
}
app.post('/registration',
    async function(req,res){
        try{
            const existUser = await User.findOne({where:{email:req.body.email}})
    if(existUser){
        return re.status(400).json({message:'User Already exists'})
    }else{
        const hashpswd = await bcrypt.hash(req.body.password, 20);
        let userdetails = {
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email: req.body.email,
            password:hashpswd,
            mobile_number:req.body.mobile_number,
        }
        const NewUser = await User.create(userdetails)
        return res.status(200).json(
            {message:'User Registered Successfully',
            User: {id:NewUser.id, email:NewUser.email}
        })
    }
    } catch(err){
        console.log(err);
        return res.status(500).json({message:'server error'})
    }
})

app.post('/login', async function (req,res){
    try{
const {email, password }  = req.body;
        if (email && password){
            const user = await  User.findOne({ where: {email} });
            const isvalidpassword = await bcrypt.compare(password , user.password);

            if(!isvalidpassword){
                const token = jwt.sign({id:user.id, email:user.email}, process.env.JWT_SECRET , {expiresIn :'1h'});
                return res.status(200).json({massage:'Login Successfully',token})
            }
        }else{
            return res.status(500).json({message:'UserName Required'})
        }
        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'server error'})
    }
});
const PORT = 8899;
app.listen (PORT, ()=>{
    console.log('server running')
})