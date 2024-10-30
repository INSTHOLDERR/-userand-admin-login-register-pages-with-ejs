import express from 'express';
import {registerUser,loginUser,userLogout, userContact} from '../controllers/controller.js'
import {adminLogin,dashboard, editUser, deleteUser,logoutUser,adminRegisterUser} from '../controllers/adminController.js'

const router = express.Router();





//users

const isLogin = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/home');
    }
    next(); 
};


const isNotLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next(); 
};

const isAdminLogin = (req, res, next) => {
    if (req.session.admin) {
        return res.redirect('/dashboard');
    }
    next();
};

const isAdminNotLogin = (req, res, next) => {
    if (!req.session.admin) {
        return res.redirect('/adminlogin');
    }
    next();
};

// const isUser=(req,res,next)=>{
//     if(!req.session.user){
//         return res.redirect('/login')
//     }
//     next()
// }

router.get('/home', isNotLogin, (req, res) => {
    res.render('home', { user: req.session.user });
});

router.get('/',isLogin,isAdminLogin, (req, res) => {
    res.render('login', { error: null });
});

router.get('/login',isLogin, isAdminLogin,(req, res) => {
    res.render('login', { error: null });
});

router.get('/register',isLogin,isAdminLogin,(req, res) => {
    res.render('register', { error: null });
});




router.get('/logout',userLogout)
router.post('/register', registerUser);
router.post('/login', loginUser);

// router.get('/contact',isUser ,userContact);



//Admin


router.get('/adminlogin', isLogin,isAdminLogin, (req, res) => {
    res.render('adminlogin', { error: null });
});


router.get('/dashboard', isAdminNotLogin, dashboard,(req, res) => {
    res.render('dashboard', { error: null }); 
});

router.post('/adminregister',adminRegisterUser)
router.post('/adminlogin', adminLogin); 
router.post('/admin/edit/:id', editUser);
router.delete('/admin/delete/:id', deleteUser);
router.post('/adminlogout',logoutUser);









export default router;
