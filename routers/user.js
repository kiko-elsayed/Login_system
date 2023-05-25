
const express = require('express')
const User = require('../models/user')
const Cars = require('../models/user')
const auth = require('../middleware/auth')

///////////////////////////////////////////////
// -------------------------post--------------------

//جواها العمليات بتاعت الاضافه والحذف وهكذا
const router = express.Router()

router.post('/users' , (req,res)=>{
    console.log(req.body)

    // في برنامج postman يسمي ال req
    // البيانات اللي بتيجي للابليكشين

    const user = new User(req.body)
    user.save()
    .then((user) => {res.status(200).send(user)})
    .catch((e) => {res.status(400).send(e)})

})

////////////////////////////////////////////////////
//example

// router.post('/Cars' , (req , res)=>{
//     console.log(req.body)

//     const car = new Cars (req.body)
//     car.save()
//     .then((car) => {res.status(200).send(car)})
//     .catch((e) => {res.status(400).send(e)})
// })


//////////////////////////////////////////////////////////
// -------------------------get--------------------


// get all data of users
router.get('/users' ,auth , (req,res)=>{
    User.find({})
    .then ((users)=>{
        res.status(200).send(users)
    })
    .catch((e)=>{
        res.status(400).send(e)
    })
})


// get data by id

router.get('/users/:id' , auth, (req,res)=>{
    // console.log(req.params)
    const _id = req.params.id
    User.findById(_id)
    .then((user)=>{
        if(!user){
            return res.status(404).send('User not found')
        }
        res.status(200).send(user)
    })
    .catch((e)=>{
        res.status(500).send(e)
    })

})

////////////////////////////////////////////////////////
// -------------------------patch--------------------


router.patch('/users/:id' ,auth , async (req,res)=>{
    try {
        const updates = Object.keys(req.body)
        // return array that i updated in postman
        // console.log(updates)

        const _id = req.params.id

        // const user = await User.findByIdAndUpdate(_id , req.body, {
        //     // بيعدل علي الداتا وبيجيب البيانات القديمة
        //     new: true,
        //     //علشان يطبق شروط المودل اللي انا كاتبه
        //     runValidators: true,
        // })

        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('No User found')
        }

        updates.forEach((ele)=>{
            // equal every element i have updated
            // this is bracket notation not dot notation 
            user[ele] = req.body[ele]
            /*
                ['age' , ''password]
                user[age] = req.body[age]
            */
            
        })

        await user.save();

        res.status(200).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})




///////////////////////////////////////////////////////////////
// -------------------------delete--------------------

router.delete('/users/:id' ,auth , async (req,res)=>{
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if(!user){
            return res.status(404).send('No User found')
        }
        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send(error)
    }
})

////////////////////////////////////////////////////////////////////

//login 

router.post( '/login' , async(req , res) =>{
    try {
        const user = await User.findByCredentials( req.body.email , req.body.password )
        const token = await user.generateToken()

        res.status(200).send({user , token})

    } catch (e) {
        res.status(400).send(e.message)
    }

})

////////////////////////////////////////////////////
// lec_14          token use when user post data

router.post('/users' , async (req,res) =>{
    try {
        const user = new User(req.body)
        const token = await user.generateToken()

        await user.save()
        res.status(200).send({user , token})

    } catch (e) {
        res.status(400).send(e.message)
    }
    
})

///////////////////////////////////////////////////////////////////////////////////////////
// lec_15


// Profile : 

router.get('/profile', auth , async(req,res)=>{
    res.status(200).send(req.user)
})

///////////////////////////////////////
// logout :

router.delete('/logout',auth,async(req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

//////////////////////////////////////////
// logoutAll :

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})


////////////////////////////////////////////////////////////////////////////////////////////

















module.exports = router;