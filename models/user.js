
const mongoose = require('mongoose')
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const  jwt = require ('jsonwebtoken')



const userSchema = new mongoose.Schema({

        username: {
            type: String,
            required: true ,
            trim : true 
        },
        password: {
            type: String,
            required: true ,
            trim : true ,
            minlength : 8 ,
            validate(value){
                let password =  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
                if (!password.test(value)) {
                    throw new Error ("password should have upper letter and small and special character")
                }

            }
        }, 
        email: {
            type: String,
            required: true ,
            trim : true ,
            lowercase : true ,
            unique: true ,
            validate(val){
                if (!validator.isEmail(val)) {
                    throw new Error ("this email is invalid")
                }
            }
        },
        age :{
            type: Number,
            default: 18,
            validate(val){
                if (val <= 0) {
                    throw new Error ("age must be greater than 0")
                }
            }
        },
        city: {
            type: String,
        },
        tokens : [
            {
                type : String ,
                required : true
            }
            
        ]

    
})

userSchema.pre("save" , async function (){
    const user = this
    console.log(user)

    if(user.isModified('password'))
    user.password = await bcryptjs.hash ( user.password , 8) 

    // if (user.password !== newPassword) 
    // user.password = await bcryptjs.hash(newPassword, 8);
    // user.password = $setOnInsert; { password: bcryptjs.hashSync( user.password , 8) }

})
/////////////////////////////////////////////////////////

// logic for login

// statics allow you to use function in model

userSchema.statics.findByCredentials = async ( em , pass)=>{

    const user = await User.findOne({email:em})
    
    if (!user) {
        throw new Error ("unable to login  ")
    }
    // bcrypt used in compare password
    const isMatch = await bcryptjs.compare( pass , user.password)

    if (!isMatch) {
        throw new Error ("unable to login ")
    }

    return user ;

}

///////////////////////////////////////////////////////////////////////////
// Lec_14     token

userSchema.methods.generateToken = async function () {
    const user = this
    //                      id            -          token
    const token = jwt.sign({_id:user._id.toString()} , "islam500" )
    // do concat on the data to user
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
} 


////// hide private data from frontend

userSchema.methods.toJSON = function (){
    // to catch document 
    const user = this 

  //    convert doc to obj  = toObject 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject 
}

///////////////////////////////////////////////////////////////////////////
// lec_16       virtual relation between user and their tasks

userSchema.virtual('tasks' ,{
    ref:"Task" ,
    // الحاجه المشتركة بينا عندي
    localField : "_id" ,
    // الحاجه المشتركة بينا عنده
    foreignField : "owner"
})












//////////////////////////////////////////////////

const User = mongoose.model('User' , userSchema )

module.exports = User ;

