const libExpress=require("express")
const cors=require("cors")
const server=libExpress()
server.use(cors())
server.post("/users",(req,res)=>{
    console.log("Request accepted")
    res.send("Account Created.")

})
server.post("/players",(req,res)=>{
    console.log("Request accepted of player")
    res.send("Profile Created.")

})
server.post("/team",(req,res)=>{
    console.log("Request accepted of team")
    res.send("team Created.")

})
server.get("/users",(req,res)=>{
    res.json(
        [   {name: "u1"},
            {name: "u2"},
            {name: "u3"},
            {name: "u4"}
        ]
    )
})

server.listen(8000,()=>{
    console.log("Server is listing over port 8000");
})