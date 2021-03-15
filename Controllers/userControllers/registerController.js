const User = require("../../Models/user");
const bcrypt = require("bcrypt");

// Array to send custom error messages 
let errors = [];

const renderRegisterPage = async (req,res) => {
    res.render("register.ejs", {errors:""});
}

const submitNewAccount = async (req,res) => {
    //reset error-array
    errors = [];

    //get data from req.body
    const {username, email, password} = req.body;

    //handling error in case user don't type in anything
    if(!username){
        errors.push(" Username is required!")
    }
    if(!email){
        errors.push(" Email is required!")
    }
    if(!password){
        errors.push(" Password is required!")
    }

    try {
        
        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Save in DB
        await new User({
            username: username,
            email: email,
            password: hashedPassword
        }).save();

        //req.flash('notify', "Account sucessfully created!");
        return res.redirect("/login");
        

    } catch (err) {
        if(errors) {
            return res.render("register.ejs", {errors: errors});
        }
    }

}

module.exports = {
    renderRegisterPage,
    submitNewAccount
}