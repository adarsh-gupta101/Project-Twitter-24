const express=require("express")
const app=express()
const port=3000
const router=express().router()


app.get("/",(req,res)=>{
    res.send("Hello World")
})
const user=require("./routes/user_lookup.js")

app.use("/user",user)
app.listen(port,()=>{
    console.log("Server is running on port "+port)
})