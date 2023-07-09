import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editableTodo, setEditableTodo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/todos').then((res) => {
      res.json().then((data) => {
        console.log(data);
        setTodos(data);
      });
    });
  }, []);

  function handleSubmit() {
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        description: description,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      res.text().then(() => {
        const newTodo = [
          ...todos,
          {
            title: title,
            description: description,
          },
        ];
        console.log(newTodo);
        setTodos(newTodo);
      });
    });
  }

  function handleEdit(todo) {
    setEditableTodo(todo);
    setEditMode(true);
    // Set the initial title and description values for editing
    setTitle(todo.title);
    setDescription(todo.description);
  }

  function handleSave() {
    // Perform the update request here with the updated title and description
    fetch('http://localhost:3000/todos/' + editableTodo.id, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        description: description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.ok) {
        // Update the corresponding todo in the todos array
        const updatedTodos = todos.map((todo) => {
          if (todo.id === editableTodo.id) {
            return {
              ...todo,
              title: title,
              description: description
            };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setEditMode(false);
        setEditableTodo(null);
      }
    }).catch((error) => {
      console.log('Error updating todo:', error);
    });
  }

  return (
    <div>
      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <br />
      <input
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button onClick={handleSubmit}>send</button>

      {todos.map((todo) => (
        <div key={todo.id}>
          {editableTodo && editableTodo.id === todo.id && editMode ? (
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <br />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
              {/* Pass the todo object as an argument to handleSave */}
              <button onClick={() => handleSave(todo)} >Save</button>
            </div>
          ) : (
            <span onClick={() => handleEdit(todo)} key={todo.id}>
              {todo.title}
              <br/>
              {todo.description}
              <br/>
            </span>
          )}
          <button
            onClick={() => {
              fetch('http://localhost:3000/todos/' + todo.id, {
                method: 'DELETE',
              }).then(() => {
                console.log('deleted');
                setTodos(todos.filter((a) => a.id !== todo.id));
              });
            }}
          >
            delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
