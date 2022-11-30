import express from "express"
import dotenv from "dotenv"
const app = express();
import session from "express-session"
dotenv.config()
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
import user  from "./routes/user_lookup.js";

app.use("/user", user);
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
