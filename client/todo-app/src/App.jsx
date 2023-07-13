import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { blue } from "@mui/material/colors";
import './index.css'
import zIndex from "@mui/material/styles/zIndex";


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
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.19)",
        justifyContent: "center",
        flexFlow:"column",
        marginTop:"30px",
        padding: "10px",
        width: "500px",
        zIndex: 1,
        pointerEvents: editMode ? "none" : "auto",
        margin: "0 auto"
      }}>
        <TextField style={{borderBottom: "3px solid white",}} InputLabelProps={{
        sx: {
          color: 'white',
          textTransform: 'capitalize',
        },
      }}
      sx={{ input: { color: 'white' } }}id="standard-basic" label="title" variant="standard"
        placeholder="title"
        value = {title}
        onChange={(e)=> setTitle(e.target.value)}>
        </TextField>
        <br/>
        <TextField style={{borderBottom: "3px solid white",}} InputLabelProps={{
          sx: {
            color: 'white',
            textTransform: 'capitalize',
          },
        }}
        id="standard-multiline-static" label="description" variant="standard" 
        placeholder="description"
        sx={{ input: { color: 'white' },
        "& .MuiInputBase-root": {
          color: 'white'
        }
        }}
        multiline
        value = {description}
        onChange={(e)=> setDescription(e.target.value)}
        minRows={3}
        maxRows={7}
        fullWidth={1}>
        </TextField>
        <Button 
          style={{color: "white",marginTop: 10, width: 100}}
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
            <div style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
              backgroundColor: "#F2A290",
              zIndex: 2,
              height: "90vh",
              minHeight: "10vh",
              position: "fixed",
              top: "2vh",
              left: "2vh",
              right: "2vh",
              padding: "3vh"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <TextField style={{borderBottom: "3px solid white",}} InputLabelProps={{
                sx: {
                  color: 'white',
                  textTransform: 'capitalize',
                },
              }}
              sx={{ input: { color: 'white' } }}fullWidth={1}
              id="standard-basic" label="title" variant="standard" size = "small"
              type="text"
              value={editableTitle}
              onChange={(e)=> setEditableTitle(e.target.value)}>
              </TextField>
              <Button style={{color: "white"}}variant="text" onClick={() => {editTodo(editableTodo); document.body.style.overflow = "";}}>save</Button>
              </div>
              <br/>
              <div style={{
                display: "flex",
              }}>
              <TextField style={{borderBottom: "3px solid white",}} InputLabelProps={{
                sx: {
                  color: 'white',
                  textTransform: 'capitalize',
                },
              }}
              
              sx={{ input: { color: 'white' },
              "& .MuiInputBase-root": {
                color: 'white'
              }
              }}multiline 
              id="standard-basic" label="description" variant="standard" size = "small"
              type="title"
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
              minRows={25}
              maxRows={25}
              fullWidth={1}>
              </TextField>
              </div>
              
              
            </div>
          )
          :
          (
              <div 
              style={{
                backgroundColor :"#F2A290",
                borderRadius: "2px",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
                color: "white",
                width: "900px",
                minWidth: "30%",
                maxWidth: "100%",
                padding: "10px",
                textAlign: "left",
                margin: "10px",
                cursor: "pointer",
                zIndex: 1,
                pointerEvents: editMode ? "none" : "auto"
              }}
              key = {todo.id} onClick={() => {
                setEditMode(true);
                setEditableTodo(todo);
                setEditableTitle(todo.title);
                setEditableDescription(todo.description);
                document.body.style.overflow = "hidden";
                }}>
                <h2>{todo.title}</h2>
                <p style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{todo.description}</p>
              </div>
            )}

            <Button style={{color: "white"}}
              variant="text"
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