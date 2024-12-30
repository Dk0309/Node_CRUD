const express = require('express');
const router = express.Router();
const UserModel = require("../models/users");
const multer = require('multer');
const fs = require('fs');

//image upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
    },

})

var upload = multer({
    storage: storage,
}).single('image');

router.get("/", async (request, response) => {
     const users = await UserModel.find({});
     response.render('index',{
        title: 'Home Page',
        users: users,
     })
    //   response.send(users);
  });

router.get('/add', (req,res) => {
    res.render('add_users', {title: "Add Users"})
})

router.post('/add',upload, (req,res) => {
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    // user.save((err,result) => {
    //     if(err){
    //         res.json({message: err.message, type: 'danger'});
    //     }else {
    //         console.log(result);
    //         req.session.message = {
    //             type: 'success',
    //             message: 'User Added Successfully!'
    //         };
    //         res.redirect('/');
    //     }
    // })
    user.save()
    req.session.message = {
                    type: 'success',
                    message: 'User Added Successfully!'
                };
                res.redirect('/');
})

router.get('/edit/:id', async (req,res) => {
    let id = req.params.id;
    const user = await UserModel.findById(id);
    // UserModel.findById(id, (err, user) => {
    //     if(err){
    //         res.redirect('/');
    //     }else {
            if(user == null){
                res.redirect('/');
            }else {
                res.render('edit_users', {
                    title: "Edit User",
                    user: user,
                }

                )
            }
        // }
    // })
})

router.post('/update/:id', upload, (req,res) => {
    let id = req.params.id;
    let new_image = "";

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+re.body.old_image)
        }catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    const updatedUser = {
            name: req.body.name,
            email: req.body.email,
            hone: req.body.phone,
            image: new_image,
    }

    UserModel.findByIdAndUpdate(id,updatedUser,function(err,docs) {
        if(err){
            console.log(err);
        }else {
            console.log("User Updated!");
            req.session.message = {
                type: 'success',
                message: 'User Updated Successfully!',
            };
            res.redirect('/');
        }
    });
   

    // UserModel.findByIdAndUpdate(id,{
    //     name: req.body.name,
    //     email: req.body.email,
    //     hone: req.body.phone,
    //     image: new_image,
    // }, (err,result) => {
    //     if(err){
    //         res.json({message: err.message, type: 'danger'})
    //     }else {
    //         req.session.message = {
    //             type: 'success',
    //             message: 'User Updated Successfully!',
    //         };
    //         res.redirect('/');
    //     }
    // })
})

router.get('/delete/:id', (req,res) => {
    let id = req.params.id;
    UserModel.findByIdAndDelete(id)
      .then(deletedUser => {
        if (deletedUser) {
          console.log('User deleted successfully:', deletedUser);
          fs.unlinkSync('./uploads/' + deletedUser.image);
          res.redirect('/');
          res.session.message = {
                        type: 'success',
                        message: 'User Deleted Successfully!'
                    };
                    
        } else {
          console.log('User not found');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
    // UserModel.findByIdAndDelete(id, (err, result) => {
    //     if(result.image != ''){
    //         try{
    //             fs.unlinkSync('./uploads' + result.image);
    //         }catch(err){
    //             console.log(err);
    //         }    
    //     }

    //     if(err){
    //         res.json({message: err.message });
    //     }else {
    //         res.session.message = {
    //             type: 'success',
    //             message: 'User Deleted Successfully!'
    //         };
    //         res.redirect('/');
    //     }
    // })
})

module.exports = router;