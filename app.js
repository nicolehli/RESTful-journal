var express     = require("express"), 
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

// APP CONFIG  
mongoose.connect("mongodb://localhost/blogDB", {useMongoClient: true})
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

// MONGOOSE-MODEL CONFIG
var blogSchema  = new mongoose.Schema({
    title:  String,
    image:  String,
    body:   String,
    created: {
        type:       Date,
        default:    Date.now,
    }
})
var Blog = mongoose.model("Blog", blogSchema)

// RESTFUL ROUTES

// PORT SETUP
var port        = process.env.PORT | 3000;
app.listen(port, process.env.IP, function(){ 
    console.log("SERVER IS RUNNING")
})

