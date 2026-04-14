import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import TodoListitem from '../TodoListItem';
import TodoForm from './TodoForm';
import AddIcon from '@mui/icons-material/Add';
import NavBar from './NavBar';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const initialTodos = [
      { id: uuid(), text: 'Code 10hrs a day', completed: false },
      { id: uuid(), text: 'Eat healthy', completed: true },
      { id: uuid(), text: 'Focus on goals', completed: false },
      { id: uuid(), text: 'Dont watch porn.', completed: false }
]

//GET THE INTITIAL DATa FORM LOCALSTORAGE IF AVAILABLE
const getInitialData = () => {
      const data = JSON.parse(localStorage.getItem('todos'));
      if (!data) {
            return [];
      }
      return data;

}

export default function CheckboxList() {
      const [todos, setTodos] = useState(getInitialData);
      const [alert, setAlert] = useState(false)
      useEffect(() => {
            localStorage.setItem('todos', JSON.stringify(todos))

      }, [todos]);

      const showAlert = () => {
            setAlert(true);
            return;

      }

      const removeTodos = (id) => {
            setTodos((prevTodo) => {
                  return prevTodo.filter((todo) => todo.id !== id)
            })
      }

      const handleToggle = (id) => {

            setTodos((prevTodo) => {
                  return prevTodo.map((todo) => {
                        if (todo.id === id) {
                              return {
                                    ...todo, completed: !todo.completed

                              }
                        }
                        return todo
                  })

            });
      }
      const addTodo = (txt) => {
            setAlert(false)
            setTodos((prevTodo) => {
                  if (txt !== "") {

                        return [
                              ...prevTodo,
                              { text: txt, id: uuid(), completed: false }
                        ]
                  } else {
                        showAlert();
                        return prevTodo;
                  }
            })


      }

      return (
            <Box>
                  {alert && (
                        <Alert variant='filled' severity='error' sx={{ mb: 2 }}>Text must not be empty!
                        </Alert>
                  )}

                  <NavBar sx={{ mb: 2 }} />
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>


                        <TodoForm setTodo={addTodo} showAlert={setAlert} />

                        {todos.map((todo) => {
                              const labelId = `checkbox-list-label-${todo.id}`;

                              return <TodoListitem todo={todo} key={todo.id} removeItem={removeTodos} toggle={() => handleToggle(todo.id)} sx={{ textDecorationLine: 'dashed' ? todo.completed : 'none' }} />
                        }
                        )}
                  </List >
            </Box>
      )
}
