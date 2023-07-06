const express = require('express')
const bodyParser = require('body-parser')
const path = require("path")
const cors = require("cors")

const port = 3000

app = express()

app.use(cors())

app.use(bodyParser.json())

var todos = [];

function postList(req,res){
    var todoTitle = req.body.title;
    var todoDescription = req.body.description;
    var todoId = Math.floor(Math.random()* 10000);

    var todoObj = {
        id: todoId,
        title: todoTitle,
        completed: false,
        description: todoDescription
    };

    todos.push(todoObj)
    console.log(todos);
    res.status(201).send("todo stored succesfully")
}

function getList(req,res){
    res.status(200).send(todos)
}

function findIndex(arr, id){
    for(let i=0; i< arr.length; i++){
        if(arr[i].id === id){
            return i;
        }
    }
}

function gettodo(req, res){
    var id = parseInt(req.params.id);
    const index = findIndex(todos, id)
    if (index === -1 || index >= todos.length) {
        res.status(404).send('Todo not found.');
    }
    else{
        res.send(todos[index]);
    } 
}

function removeAtIndex(arr, index){
    let newArray = [];
    for(let i = 0; i<arr.length; i++){
        if(i !== index){
            newArray.push(arr[i])
        }
    }
    return newArray;
}

function deleteTodo(req, res){
    var index = findIndex(todos, parseInt(req.params.id))
    todos = removeAtIndex(todos, index)
    res.json(todos);
}

function updateTodo(req, res){
    var index = findIndex(todos, parseInt(req.params.id))
    todos[index].title = req.body.title
    todos[index].description = req.body.description
    res.json(todos)
}

app.post('/todos', postList)
app.get('/todos', getList)
app.get("/todos/:id", gettodo)
app.delete("/todos/:id", deleteTodo)
app.put("/todos/:id", updateTodo)
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "index.html"));
})

app.listen(3000, () =>{
    console.log(`server is running on port ${port}`)
})