import User from '../models/model.js';
import bcrypt from 'bcryptjs';

// const admins = [{ email: 'nikhil@gmail.com', password: 'Nikhil' }, { email: 'sree@gmail.com', password: 'Nikhil' }];

// export const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(422).render('adminlogin', { error: "Please fill in all fields." });
//         }

//         const admin = admins.find((admin) => admin.email.toLowerCase() === email.toLowerCase());
//         if (!admin) {
//             return res.status(422).render('adminlogin', { error: "Invalid User." });
//         }

//         if (password !== admin.password) {
//             return res.status(422).render('adminlogin', { error: "Invalid Password." });
//         }
//         req.session.admin = { email: admin.email };


//         return res.redirect('/dashboard');
//     } catch (error) {
//         console.error('Admin login error:', error);
//         return res.status(500).render('adminlogin', { error: "Login failed. Please try again." });
//     }
// };


export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).render('adminlogin', { error: "Please fill in all fields." });
        }
        const user = await User.findOne({ email: email.toLowerCase(), isAdmin: true });
        if (!user) {
            return res.status(422).render('adminlogin', { error: " account not found." });
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return res.status(422).render('adminlogin', { error: "invalid password." });
        }

        req.session.admin = { email: user.email, isAdmin: true };
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Admin login error', error);
        return res.status(500).render('adminlogin', { error: "Login failed. " });
    }
}




export const dashboard = async (req, res) => {
    try {
        const users = await User.find();
        res.render('dashboard', { users, error: null });
    } catch (error) {
        console.error('Error fetching users', error);
        res.render('dashboard', { users: [], error: "Failed  fetch users." });
    }
};


export const adminRegisterUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.render('dashboard', { error: "Fill  all fields.", users: await User.find() });
        }




        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render('dashboard', { error: "Invalid email", users: await User.find() });
        }
        const newEmail = email.toLowerCase();
        console.log(newEmail);






        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return res.render('dashboard', { error: "email already exists.", users: await User.find() });
        }
        if (password.trim().length < 6) {
            return res.render('dashboard', { error: "Password should be at least 6 characters.", users: await User.find() });
        }
        if (password !== confirmPassword) {
            return res.render('dashboard', { error: "Passwords do not match.", users: await User.find() });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        console.log(hashedPass);



        const newUser = await User.create({ name, email: newEmail, password: hashedPass });





        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error', error);
        return res.render('dashboard', { error: "User registration failed.", users: await User.find() });
    }
};

export const editUser = async (req, res) => {
    const { userId, name, email } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { name, email });
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error ', error);
        res.render('dashboard', { error: "Failed  update user.", users: await User.find() });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error', error);
        res.status(500).render('dashboard', { error: "Failed", users: await User.find() });
    }
};


export const logoutUser = async (req, res) => {
    req.session.admin = null;
    res.redirect('/adminlogin');
};
