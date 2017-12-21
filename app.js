var express         = require("express"), 
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose"),
    expressSanitizer = require("express-sanitizer");

// APP CONFIG  
mongoose.connect("mongodb://localhost/blogDB", {useMongoClient: true})
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())  // This must go after bodyParser
app.use(methodOverride("_method"))

// MONGOOSE-MODEL CONFIG
var blogSchema  = new mongoose.Schema({
    title:    String,
    body:     String,
    image:    String,
    created: {
        type:       Date,
        default:    Date.now,
    }
})
var Blog = mongoose.model("Blog", blogSchema)

// Test Blog
// Blog.create({
//     title:       "Some title First",
//     body:        "Test Blog First",
//     image:       "https://images.pexels.com/photos/176381/pexels-photo-176381.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
// })

// RESTFUL ROUTES

app.get("/", function(req,res){
    res.redirect("/blogs")
})

// INDEX ROUTE
app.get("/blogs", function(req,res){
    // list all blogs
    Blog.find({}, function(err, foundBlogs){
        if(err){
            console.log(err)
        } else { 
            res.render("index", {blogs: foundBlogs})
        }
    })

})

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    // show new blog form
    res.render("new")
})

// CREATE ROUTE
app.post("/blogs", function(req, res){
    // req.body is from the form
    // blog is object we named in new.ejs form inputs
    // and blog.body is from blog[body] from form input
    console.log(req.body) // before sanitize
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log("=============================")
    console.log(req.body) // after sanitize
    
    // create a new blog
    // create(data, callback)
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render('new')
        } else { 
            res.redirect("/blogs")
        }
  })
    
})

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else { 
            res.render("show", {blog: foundBlog})
        }
    })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs")
            console.log(err)
        } else {
            res.render("edit", {blog: foundBlog})
        }
    })
})

// UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
            console.log(err)
        } else { 
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    // res.send("You have reached destroy route")   // for testing
    Blog.findByIdAndRemove(req.params.id, function(err, removedBlog){
        if(err){
            res.redirect("/blogs")
            console.log(err)
        } else {
            res.redirect("/blogs")
        }
    })
})

// PORT SETUP
var port        = process.env.PORT | 3000;
app.listen(process.env.PORT, process.env.ID, function(){ 
    console.log("SERVER IS RUNNING")
})

