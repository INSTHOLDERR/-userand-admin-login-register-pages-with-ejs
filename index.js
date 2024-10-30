import express from 'express';
import session from 'express-session';
import router from './routers/router.js';
import conn from './connect.js';
import dotenv from 'dotenv';
import nocache from 'nocache';

dotenv.config();



const app = express();

app.use(nocache());
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret: 'kjhaljkfdjgkfdngndfknbjdjhu',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store,no-cache,must-revalidate,private');
    next();
});

app.use('/', router); 

conn().then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, (error) => {
        if (error) {
            return console.log(error);
        }
        console.log(`http://localhost:${PORT}`);
    });
}).catch(error => {
    console.log('Failed to connect to MongoDB', error);
});
