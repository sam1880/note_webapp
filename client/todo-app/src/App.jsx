import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const[todos, setTodos] = useState([]);
  const[title, setTitle] = useState('');
  const[description, setDescription] = useState('');

  useEffect(() =>{
    setInterval(() =>{
      fetch("http://localhost:3000/todos").then((res) =>{
        res.json().then(data => {
          console.log(data)
          setTodos(data)
        })
      })
    }, 1000)
  }, [])

  function handleSubmit(){

      fetch("http://localhost:3000/todos", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description
        }),
        headers: {
          'Content-Type': "application/json"
        },
      }).then((res)=>{
        res.text().then((data)=>{
          console.log(data)
        })
      })
    }


return(
  <div>
    
  <input placeholder='title' value={title} onChange={e => setTitle(e.target.value)}></input><br/>
  <input placeholder='description' value={description} onChange={e => setDescription(e.target.value)}></input>
  <button onClick = {handleSubmit}>send</button>

    {todos.map(todo =>{
      return(
        <div key = {todo.id}>
          {todo.title}<br/>
          {todo.description}<br/>
          <button onClick={()=>{
            fetch("http://localhost:3000/todos/" + todo.id, {
              method: "DELETE"
            }).then(()=>{console.log("deleted")})
          }}>delete</button>
        </div>
      )
    })}
  </div>
)
}

export default App
