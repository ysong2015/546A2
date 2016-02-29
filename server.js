// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var toDoTasks = require('./toDoEntries.js');

// This package exports the function to create an express instance:
var app = express();

// We can setup Jade now!
app.set('view engine', 'ejs');

// This is called 'adding middleware', or things that will help parse your request
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// This middleware will activate for every request we make to 
// any path starting with /assets;
// it will check the 'static' folder for matching files 
app.use('/assets', express.static('static'));

app.use(function (req, res, next) {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }

    // let the next middleware run:
    next();
});

// Setup your routes here!

app.get("/", function (request, response) { 
    // We have to pass a second parameter to specify the root directory
    // __dirname is a global variable representing the file directory you are currently in
    response.sendFile("./pages/index.html", { root: __dirname });
});

app.get("/api/todo", function (request, response) {
    var displayType = "",
        toDOEntrytoShow = [];
    displayType = "All Tasks";
    toDOEntrytoShow = toDoTasks.getAllToDoTasks();
    console.log(toDOEntrytoShow);
    response.render('pages/home', { task: toDOEntrytoShow, type: displayType, pageTitle: "To-Do List" });
});

app.get("/api/todo/open", function (request, response) {
    var displayType = "",
        toDOEntrytoShow = [];
    displayType = "Open Tasks";
    toDOEntrytoShow = toDoTasks.getOpenToDoTasks();
    response.render('pages/home', { task: toDOEntrytoShow, type: displayType, pageTitle: "To-Do List" });
});

app.get("/api/todo/completed", function (request, response) {
    var displayType = "",
        toDOEntrytoShow = [];
    displayType = "Completed Tasks";
    toDOEntrytoShow = toDoTasks.getCompletedToDoTasks();
    response.render('pages/home', { task: toDOEntrytoShow, type: displayType, pageTitle: "To-Do List" });
});

app.get("/api/todo/:id", function (request, response) {
    try {
        var task = toDoTasks.getToDoTask(request.params.id);
        // we caught an exception! Let's show an error page!
        response.render('pages/task', { task: task, pageTitle: task.taskTitle });
    } catch (error) {
        // we caught an exception! Let's show an error page!
        response.render('pages/error', { errorType: "Issue loading question!", errorCode: error.code, errorMessage: error.message });
    }
});

// Create a new task
app.post("/api/todo", function (request, response) {
    try {
        console.log(request.body);
        var task = toDoTasks.addToDoTask(request.body.author, request.body.taskTitle, request.body.taskDescription);
        response.render('pages/task', { task: task, pageTitle: task.taskTitle });
    } catch (error) {
        // we caught an exception! Let's show an error page!
        response.render('pages/error', { errorType: "Issue creating question!", errorCode: error.code, errorMessage: error.message });
    }
});

// Update a task
app.put("/api/todo/:id", function (request, response) {
    try {
        var task = toDoTasks.updateToDoTask(request.params.id, request.body.taskTitle, request.body.taskDescription, request.body.status);
        // we caught an exception! Let's show an error page!
        response.render('pages/task', { task: task, pageTitle: task.title });
    } catch (error) {
        // we caught an exception! Let's show an error page!
        response.render('pages/error', { errorType: "Issue updating question!", errorCode: error.code, errorMessage: error.message });
    }
})

// Add a note for the task
app.post("/api/todo/:id/notes", function (request, response) {
    try {
        var task = toDoTasks.addNotes(request.params.id, request.body.taskNotes);
        response.render('pages/task', { task: task, pageTitle: task.taskTitle });
    } catch (error) {
        // we caught an exception! Let's show an error page!
        response.render('pages/error', { errorType: "Cannot answer question!", errorCode: error.code, errorMessage: error.message });
    }
});

app.delete("/api/todo/:id", function (request, response) {
    try {
        console.log("====" + request.params.id);
        toDoTasks.deleteToDoTask(request.params.id);
        var toDOEntrytoShow = toDoTasks.getAllToDoTasks();
        console.log(toDOEntrytoShow);
        response.render('pages/home', { task: toDOEntrytoShow, type: "All Tasks", pageTitle: "To-Do List" });
    } catch (error) {
        // we caught an exception! Let's show an error page!
        response.render('pages/error', { errorType: "Cannot answer question!", errorCode: error.code, errorMessage: error.message });
    }
});

// We can now navigate to localhost:3000
app.listen(3000, function () {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
