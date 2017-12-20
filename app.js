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

// Test Blog
// Blog.create({
//     title:  "Test Blog",
//     image:  "https://images.pexels.com/photos/176381/pexels-photo-176381.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
//     body:   "Hello World, this is the blog body.",
// })

// RESTFUL ROUTES

app.get("/", function(req,res){
    res.redirect("/blogs")
})


app.get("/blogs", function(req,res){
    Blog.find({}, function(err, foundBlogs){
        if(err){
            console.log(err)
        } else { 
            res.render("index", {blogs: foundBlogs})
        }
    })

})


// PORT SETUP
var port        = process.env.PORT | 3000;
app.listen(process.env.PORT, process.env.ID, function(){ 
    console.log("SERVER IS RUNNING")
})

