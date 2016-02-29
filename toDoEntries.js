var exports = module.exports = {};

var toDoList = [];

var makeAnToDOTask = function (author, taskTitle, taskDescription) {
    if (!author || !taskTitle || !taskDescription)
        throw { code: 500, message: "You must provide valid information in the request body to create an entry." };
    return { id: toDoList.length + 1, author: author, taskTitle: taskTitle, taskDescription: taskDescription, taskNotes: [], status: "open" };
}

exports.getAllToDoTasks = function () {
    return toDoList.slice(0);
};

exports.getOpenToDoTasks = function () {
    return toDoList.filter(function (toDoEntry) {
        return toDoEntry.status == "open";
    });
}

exports.getCompletedToDoTasks = function () {
    return toDoList.filter(function (toDoEntry) {
        return toDoEntry.status == "completed";
    });
}

exports.getToDoTask = function (id) {
    if (typeof id === "string") id = parseInt(id);

    if (id !== 0 && !id) throw { code: 500, message: "Must provide ID" };

    var toDoEntry = toDoList.filter(function (toDoEntry) {
        return toDoEntry.id === id;
    }).shift();

    if (!toDoEntry) throw { code: 404, message: "An entry with the ID of" + " " + id + " " + "could not be found" };

    return toDoEntry;
};

exports.addToDoTask = function (author, taskTitle, taskDescription) {
    var toDoEntry = makeAnToDOTask(author, taskTitle, taskDescription);
    toDoList.push(toDoEntry);
    return toDoEntry;
};

exports.updateToDoTask = function (id, taskTitle, taskDescription, status) {
    if (!taskTitle && !taskDescription && !status)
        throw { code: 500, message: "You must provide valid information in the request body to create an entry." };

    var toDoEntry = exports.getToDoTask(id);
    toDoEntry.taskTitle = taskTitle;
    toDoEntry.taskDescription = taskDescription;
    toDoEntry.status = status;

    return toDoEntry;
};

exports.addNotes = function (id, note) {
    if (!note) throw { code: 500, message: "You must provide valid information in the request body to create an entry." };

    var toDoEntry = exports.getToDoTask(id);
    toDoEntry.taskNotes.push(note);

    return toDoEntry;
}

exports.deleteToDoTask = function (id) {
    var toDoEntry = exports.getToDoTask(id);
    var indexOfToDoEntry = toDoList.indexOf(toDoEntry);

    toDoList.splice(indexOfToDoEntry, 1);
}

var firstToDo = exports.addToDoTask("Yumeng", "task1", "This is the description for first task.");
var secondToDo = exports.addToDoTask("Song", "task2", "This is the description for second task.");
