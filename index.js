const express=require('express');
const {User, Document} = require('./sequelize')
const bodyParser=require('body-parser')
const app=express()
const cors = require('cors')
const bcrypt = require('bcrypt-node')
const Sequelize = require('sequelize')
const Mupload =require('./multer.config')
const moment = require('moment');
app.use(bodyParser.json())
app.use(cors());



//upload file
app.post('/api/upload',Mupload.single("file"), (req, res)=>{
    console.log(req.body)
    let doc=JSON.parse(req.body.document);

   
    Document.create({
        type: doc.type,
        name: doc.name,
        data: req.file.buffer,
        date: moment(doc.date,'DD.MM.YYYY hh:mm:ss.fff'),
        userId: doc.user_id,
        number_document: doc.number_document,
        note:doc.note
      }).then(()=>{
        res.json({msg: 'File uploaded successfully! -> filename = ' + req.file.originalname});
      }).catch(err=>console.log(err))
})

app.put('/api/upload/:id?',Mupload.single("file"), (req, res)=>{
    let doc=JSON.parse(req.body.document);
    let m;
    if(doc.data){
         m={
            type: req.file.mimetype,
            date: doc.date,
            name: doc.name,
            userId: doc.user_id,
            number_document: doc.number_document,
            note:doc.note
          }
    }
    else{
        m={
            type: req.file.mimetype,
            name: doc.name,
            date: doc.date,
            data: doc.data,
            userId: doc.user_id,
            number_document: doc.number_document,
            note:doc.note
          }
    }
    Document.update(m,{where:{id:doc.id},
      returning: true,
      plain: true},
      ).then((x)=>{
        res.json(x);
      }).catch(err=>console.log(err))
})
app.get('/api/documents', (req,res)=>{
    Document.findAll().then(documents=>{res.json(documents)})
})
app.delete('/api/documents/:id?',(req,res)=>{
    Document.destroy({where:{id:req.params.id}}).then(res.status(200).send({message:'document delete'}))
})


// document
app.get('/api/document/:userId?', (req,res)=>{
    let query;
    if(req.params.userId){
        query=Document.findAll({include:[
            {model:User,where:{id:req.params.userId}},
            {model:Tag}
        ]})
    } else{
        query=Document.findAll({include:[User]})
    }
})




//registration
app.post('/api/users/register',(req,res)=>{
    let Newuser=req.body;
    let duplicateUser =User.findAll({where:{name:Newuser.username}}).then(x=>{
        if ( x.length>0) {
            
            res.status(500).send({message:'Username "' + Newuser.username + '" is already taken'}  );

        }
        else{
            bcrypt.hash(Newuser.password,null,null,(err,hash)=>{
                
                User.create({name:Newuser.username,password:hash,firstname:Newuser.firstname, lastname: Newuser.lastname}).then(x=>{ res.status(200).send({message:'success'})});
            })
            
        }
        
    });
    
 
})
//authenticate
app.post('/api/users/authenticate',(req,res)=>{
    let Auth=req.body;
    User.findOne({where:{name:Auth.username}}).then(x=>{
       
        bcrypt.compare(Auth.password,x.password,(err,result)=>{
            if(result==true){
                let body = {
                    id: x.id,
                    username: x.username,
                    firstname: x.firstname,
                    lastname: x.lastname,
                    token: 'fake-jwt-token'
                };
                res.status(200).send({body:body})
            }
        })
    }).catch(err=>{
        res.status(401).send({message:'Username or password is incorrect'})
    })
})

//start

const port = 3000
app.listen(port, ()=>{
    console.log("RUN")
})