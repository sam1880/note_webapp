import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const[todos, setTodos] = useState([]);

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

return(
  <div>
    
  <input placeholder='title' id='title' value={this.state.title}></input><br/>
  <input placeholder='description' id='description' value={this.state.description}></input>
  <button onClick = {()=>{
    fetch("http://localhost:3000/todos"),{
      method: "POST",
      body: JSON.stringify({
        title: this.state.title,
        description: this.state.description
      })
    }.then((res)=>{
      res.json().then((data)=>{
        console.log(data)
      })
    })
  }}>send</button>

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
