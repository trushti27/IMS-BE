const { MongoClient, ObjectId } = require('mongodb');
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
            console.log(token)
            //return token
            res.status(200).json({"token": token});
        }
        else
        {
            res.status(400).json({err: "inavalid id or password!!"})
        }
    connection.close()
    }
    else
    res.status(401).json({err: "missing required field"})
    
})

//get roles of users
server.get("/users/roles",async(req,res)=>{
    if(req.headers.token)
    {
        await connection.connect()
        const db=await connection.db('ims')
        const collection= await db.collection('user')
        const result= await collection.find({"token": req.headers.token}).toArray()
        if(result.length>0)
        {
            const user=result[0]
            const roles={
                admin: user.is_admin===true,
                owner:!!user.owner_of,
                player:!!user.playing_for
            }
           // console.log(roles)
            res.status(200).json(roles)
        }
        else{
            res.status(400).json({err:"invalid token"})
        }
        connection.close();
    }
    else
    {
        res.status(401).json({token:"missing token"})
    }
})

//players detail
server.get("/players",async(req,res)=>{
    
        await connection.connect()
        const db=await connection.db('ims')
        const collection= await db.collection('user')
        const result= await collection.find({playing_for: {$exists: true}}).toArray()
        //console.log(result)
        res.status(200).json(result)

        connection.close()
}
)

//team detail
server.get("/teams",async(req,res)=>{
    
        await connection.connect()
        const db=await connection.db('ims')
        const collection= await db.collection('team')
       const result= await collection.find().toArray()
       // console.log(result)
        res.status(200).json(result)

        connection.close()
}
)

//player stats
server.get("/players/:id/stats",async(req,res)=>{
    if(req.params.id)
    {
         await connection.connect()
        const db=await connection.db('ims')
        const collection= await db.collection('user')
        const result= await collection.findOne({"_id": new ObjectId(req.params.id)})
        //console.log(result)
        res.status(200).json(result)

        connection.close()
}
    }
       
)
//team management-backend

server.get("/teamManage", async (req, res) => {
  try {
    if (!req.headers.token) return res.status(401).json({ error: "Unauthorized" });

    await connection.connect();
    const db = connection.db('ims');

    const users = db.collection('user');
    const teams = db.collection('team');

    // Find the user by token
    const user = await users.findOne({ token: req.headers.token });

    if (!user || !user.owner_of) {
      res.status(401).json({ error: "User or team not found" });
    }

    // Find the team using the user's owner_of field
    const team = await teams.findOne({ id: user.owner_of });

    if  (!team){
      res.status(401).json({ error: "Team not found" });
    }

    res.status(200).json(team);
  } 
  catch (err) {
    console.error("Error in /teamManage:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } 
    connection.close();

});


server.listen(8000, () => {
    console.log("Server is listing over port 8000");
})