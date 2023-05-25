/////////////////////////////////////////////////////
//Lec_14                token.


    // const  jwt = require ('jsonwebtoken')

    // const mytoken = () => {
    //                             //      unick           - secretKey
    //     const token = jwt.sign ({_id : "147258369"} , "islam510" )
    //     console.log(token)
    //                             //    token        - secretKey   
    //     const tokenVerify = jwt.verify ( token , "islam510" )
    //     console.log(tokenVerify)
    // }
    // mytoken()

//////////////////////////////////////////////
// lec 16  population => direct Relation

// const Task = require("./models/task")

// const relationFun =async ()=>{
//     const task = await Task.findById("646a22acd8cd1ad642460e64")
//     await task.populate('owner')
//     console.log(task)
//     console.log(task.owner) 

// }
// relationFun()




///////////////////////////////////////////////

const express = require("express")
const app = express()
const port = process.env.port || 3000

require('./db/mongoose') 

// to parse json automatic
app.use(express.json())

const userRouter = require('./routers/user')
app.use(userRouter)

const taskRouter = require('./routers/task')
app.use(taskRouter)

const bcryptjs = require('bcryptjs')


const passwordFunction = async ()=>{
    const password = '12345678'

    // to hash password 8 times to improve security
    const hashedPassword = await bcryptjs.hash(password , 8)

    // console.log(password)
    // console.log(hashedPassword)

    // to check if the password has changed or not
    const compare = await bcryptjs.compare( '12345678' , hashedPassword)
    // console.log(compare)

    // i need to hash password in post and patch
}
passwordFunction()




app.listen( port , ()=>{
    console.log('Server is running on port '+ port)
})













