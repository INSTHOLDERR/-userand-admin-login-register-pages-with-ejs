
import User from '../models/model.js'
import bcrypt from 'bcryptjs'


export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.render('register', { error: "Fill in all fields." });
        }
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.render('register', { error: "Invalid email." });
        }
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.render('register', { error: "Email already exists." });
        }
        if (password.trim().length < 6) {
            return res.render('register', { error: "Password should be at least 6 characters." });
        }
        if (password !== confirmPassword) {
            return res.render('register', { error: "Passwords not match." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });
        return res.redirect('/login');
    } catch (error) {
        console.error('Error ', error);
        return res.render('register', { error: "Registration failed." });
    }
};



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).render('login', { error: "Fill in all fields." });
        }
        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });
        if (!user) {
            return res.status(422).render('login', { error: "Invalid user." });
        }
        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(422).render('login', { error: "Invalid password." });
        }

        req.session.user = {
            id: user._id, email: user.email, name: user.name,
        };
        return res.redirect('/home');
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).render('login', { error: "Login failed." });
    }
};


export const userLogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/login');
    });
}

export const userContact= async (req,res)=>{
    res.end('this is contact page')
}


































