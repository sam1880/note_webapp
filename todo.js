
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
    console.log("RETURN THIS : ", {id: todoId});
    res.status(201).json(todoObj)
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


if(process.env.NODE_ENV=='production'){
    const path = require('path')

    app.get('/',(req,res)=>{
        app.use(express.static(path.resolve(__dirname,'client','dist')))
        res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
    })
}

app.listen(3000, () =>{
    console.log(`server is running on port ${port}`)
})


//delete functionality worked fine when i havent added the todo post function, now when i delete one of the recently added todos from the webpage, all the recently added todos disappear, and no todo is deleted from the backend even the one i intended to. after refreshing the page everything works fine for the already exisiting todos, but again when i add some todos, and try to delete one, all the recently added ones disappear, the old one stays, non gets deleted from the backend, and again after refresh everyhting works fine for the old existing todos
//this error was because i was returning res.status(201).json({todos})
//the above in the postlist function, which is the whole todo list
//instead i should have returned res.status(201).json(todoObj)
//only one todo object
//the warning for key was also cuz of same issue