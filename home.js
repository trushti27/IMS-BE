const { MongoClient } = require('mongodb');
const libExpress = require("express")
const libRandomString=require("randomstring")
const cors = require("cors")
const server = libExpress()
server.use(cors())

server.use(libExpress.json())

const connection = new MongoClient("mongodb://trushti:020523@localhost:27017/ims?authSource=ims")


/*server.post("/users", async (req, res) => {
    console.log("user request")
    if (req.body.name && req.body.email && req.body.password ) {
        await connection.connect()
        const db = await connection.db("ims")
        const collection = await db.collection("user")
        const result = await collection.find({ "email": req.body.email }).toArray()

        if (result.length > 0) {
            res.json("User Already Exist!")


        } else {
            await collection.insertOne({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
               
            })
            res.json("USER CREATED SUCCESSFULLY!")

        }
    }
    else{
        res.json("required field is empty")
    }
})*/


//signup
server.post("/users", (req, res) => {

    console.log(req.body)

    if (req.body.name && req.body.email && req.body.password) 
    {
        connection.connect().then(() => connection.db("ims")).then((db) => db.collection("user")).then((collection) => {

            collection.find({ email: req.body.email }).toArray()
                .then((result)=> {
                    if (result) 
                    {
                       res.json({error:"Already Exist"})
                    }
                    else 
                    {
                        collection.insertOne(req.body)
                        res.json({message:"created"})
                    }
                })
                .catch(error => {
                    console.error("Error finding user:", error);
                })
        })
        connection.close();
    }
    else
        res.json("required field is empty")
})

//log-in
server.post("/token", async(req, res) => {

    if(req.body.email && req.body.password)
    {
        console.log(req.body)
        await connection.connect()
        const db=await connection.db('ims')
        const collection= await db.collection('user')
        const result= await collection.find({"emai": req.body.emai, "password":req.body.password}).toArray()
        if(result.length>0)
        {
            //create token
            const token=libRandomString.generate(6)

            //register token into db
            const user=result[0];
            await collection.updateOne(
                    {_id: user._id},
                    {$set: {token: token }}
            )

            //return token
            res.status(200).json({token:token});
        }
        else
        {
            res.status(400).json({err: "inavalid id or password!!"})
        }

    }
    else
    res.status(401).json({err: "missing required field"})
    
})

server.get("/user/roles",(req,res)=>{
    if()
})

server.listen(8000, () => {
    console.log("Server is listing over port 8000");
})