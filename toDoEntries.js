var exports = module.exports = {};

var toDoList = [];

var makeAnToDOEntry = function (author, taskTitle, taskDescription) {
    if (!author || !taskTitle || !taskDescription)
        throw "You must provide valid information in the request body to create an entry.";
    return { id: toDoList.length+1, author: author, 
    taskTitle: taskTitle, taskDescription: taskDescription, taskNotes: [], status: "open" };
}

exports.getAllToDoEntries= function () {
    return toDoList.slice(0);
};

exports.getOpenToDoEntries=function () {
    return toDoList.filter(function (toDoEntry) {
        return toDoEntry.status=="open";
    });
}

exports.getCompletedToDoEntries=function () {
    return toDoList.filter(function (toDoEntry) {
        return toDoEntry.status=="completed";
    });
}

exports.getToDoEntry = function(id) {
    if (typeof id === "string") id = parseInt(id);

    if (id !== 0 && !id) throw "Must provide ID";

    var toDoEntry = toDoList.filter(function (toDoEntry) {
        return toDoEntry.id === id;
    }).shift();

    if (!toDoEntry) throw "An entry with the ID of"+id+"could not be found";

    return toDoEntry;
};

exports.addToDoItem=function (author,taskTitle,taskDescription) {
    var toDoEntry = exports.makeAnToDOEntry(author,taskTitle,taskDescription);
    toDoList.push(toDoEntry);
    return toDoEntry;
};

exports.updateToDoItem=function (id,taskTitle,taskDescription,status) {
    if (!taskTitle&&!taskDescription&&!status) 
    throw "You must provide valid information in the request body to create an entry.";
    
    var toDoEntry = exports.getToDoEntry(id);
    toDoEntry.taskTitle=taskTitle;
    toDoEntry.taskDescription=taskDescription;
    toDoEntry.status=status;
    
    return toDoEntry;
};

exports.addNotes=function (id,note) {
    if (!note) throw "You must provide valid information in the request body to create an entry.";
    
    var toDoEntry = exports.getToDoEntry(id);
    toDoEntry.note=note;
    
    return toDoEntry;
}

exports.deleteToDoEntry=function (id) {
    var toDoEntry=exports.getToDoEntry(id);
    var indexOfToDoEntry = toDoList.indexOf(toDoEntry);
    
    toDoList.splice(indexOfToDoEntry,1);
}