const libExpress=require("express")

const server=libExpress()

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

server.listen(8000,()=>{
    console.log("Server is listing over port 8000");
})