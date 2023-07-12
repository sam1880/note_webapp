import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';


function App(){

  const[todos, setTodos] = useState([]);
  const[title, setTitle] = useState('')
  const[description, setDescription] = useState('')
  const[editMode, setEditMode] = useState(false)
  const[editableTodo, setEditableTodo] = useState(null)
  const[editableTitle, setEditableTitle] = useState("")
  const[editableDescription, setEditableDescription] = useState("")

  function deleteTodo(todoid){
    fetch("http://localhost:3000/todos/" + todoid,{
    method: "DELETE" 
  }
    ).then(()=>{
      console.log("todo deleted")
      setTodos(todos.filter((todo) => todo.id!==todoid))
    })
  }

  function postTodo(){
    fetch("http://localhost:3000/todos",{
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()
    .then((data) =>{
        const todoId = data.id
        const newTodo = [
          ...todos,
          {
            id: todoId,
            title: title,
            description: description
          }
        ]
        setTodos(newTodo)
    }))
  }

  function editTodo(Todo) {
    fetch("http://localhost:3000/todos/" + Todo.id, {
      method: "PUT",
      body: JSON.stringify({
        title: editableTitle,
        description: editableDescription
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.ok) {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === Todo.id) {
            return {
              ...todo,
              title: editableTitle,
              description: editableDescription
            };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setEditMode(false);
        setEditableTodo(null);
      }
    });
  }

  useEffect(()=>{
    fetch("http://localhost:3000/todos")
      .then((res)=> res.json()
        .then((data)=> {
          console.log(data)
          setTodos(data)
        }));
  }, [])

  return(
    <div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexFlow:"column",
        marginTop:"30px"
      }}>
        <TextField id="standard-basic" label="title" variant="standard"
        placeholder="title"
        value = {title}
        onChange={(e)=> setTitle(e.target.value)}>
        </TextField>
        <br/>
        <TextField id="standard-multiline-static" label="description" variant="standard" 
        placeholder="description"
        multiline
        value = {description}
        onChange={(e)=> setDescription(e.target.value)}
        minRows={3}
        maxRows={7}>
        </TextField>
        <Button 
          style={{marginTop: 10}}
          variant="text"
          onClick={()=> {postTodo()}}>
          send
          </Button>
      </div>

      {todos.map((todo) =>(
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
          key = {todo.id}>

          {editMode == true && editableTodo.id === todo.id ?
          (
            <div>
              <TextField id="standard-basic" label="title" variant="standard" size = "small"
              type="text"
              value={editableTitle}
              onChange={(e)=> setEditableTitle(e.target.value)}>
              </TextField>
              <TextField multiline id="standard-basic" label="description" variant="standard" size = "small"
              type="title"
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
              maxRows={7}>
              </TextField>
              <button onClick={() => editTodo(editableTodo)}>save</button>
            </div>
          )
          :
          (
            <span 
            style={{
              minWidth: "20px",
              minHeight: "20px",
              maxWidth: "100px",
              border: "1px solid black",
              margin: "10px",
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              cursor: "pointer",
              wordWrap: "break-word"
            }}
            key = {todo.id} onClick={() => {
              setEditMode(true);
              setEditableTodo(todo);
              setEditableTitle(todo.title);
              setEditableDescription(todo.description)}}>
              {todo.id}<br/>
              {todo.title}<br/>
              {todo.description}<br/>
            </span>
          )}

          <Button variant="text"
            onClick ={() => deleteTodo(todo.id)}>
            delete</Button>

        </div>
      ))}

    </div>
  );
}

export default App;



// so in this code in line
//          <button onClick ={() => deleteTodo(todo.id)}>
// here you will have to define "() =>" annonymous function to call the other function, or you will see all todos deleted when u refresh the page

//when error says map is not a function, its most probably because u are passing non array data to it, either in state variable or the databaser data

//when u are using map function remember to use it as .map((data) =>( ... )) and not .map((data) => {..}), use baraces cuz thats a return statement for the function