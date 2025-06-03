const { MongoClient } = require('mongodb');
const libExpress = require("express")
const cors = require("cors")
const server = libExpress()
server.use(cors())

server.use(libExpress.json())

const connection = new MongoClient("mongodb://trushti:020523@localhost:27017/ims?authSource=ims")




//signup
server.post("/users", (req, res) => {

    console.log(req.body)

    if (req.body.name && req.body.email && req.body.password) {
        connection.connect().then(() => connection.db("ims")).then((db) => db.collection("user")).then((collection) => {

            collection.findOne({ email: req.body.email })
                .then(result => {
                    if (result) {
                       res.json({error:"Already Exist"})
                    } else {
                        collection.insertOne(req.body)
                        res.json({message:"created"})
                    }
                })
                .catch(error => {
                    console.error("Error finding user:", error);
                });


        })
    }
    else
        res.json("required field is empty")
})

server.get("/users", (req, res) => {


    connection.connect().then(() => connection.db("ims")).
        then((db) => db.collection("user")).then((collection) => collection.find().toArray()).
        then((result) => res.json(result)).catch((err) => console.log(err))

})

server.listen(8000, () => {
    console.log("Server is listing over port 8000");
})