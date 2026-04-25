import { useState } from 'react';;

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function TodoListitem({ todo, removeItem, toggle }) {
      // const [todo, setTodo] = useState(todo);




      return (
            //onClick={handleToggle(todo.id)} 


            <ListItem
                  key={todo.id}
                  secondaryAction={
                        <IconButton edge="end" aria-label="comments" onClick={() => removeItem(todo.id)}>
                              <DeleteOutlinedIcon />
                        </IconButton>
                  }
                  disablePadding
            >
                  <ListItemButton role={undefined} dense>
                        <ListItemIcon>
                              <Checkbox
                                    edge="start"
                                    checked={todo.completed}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': todo.id }}
                                    onChange={toggle}

                              />
                        </ListItemIcon>
                        <ListItemText id={todo.id} primary={`${todo.text}`} sx={{ textDecorationLine: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.6 : 1, color: '#000000' }} />
                  </ListItemButton>
            </ListItem>
      );
}
