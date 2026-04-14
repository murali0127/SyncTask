import { useState } from "react";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import CreateIcon from '@mui/icons-material/Create';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export default function TodoForm({ setTodo, showAlert }) {
      const [text, setText] = useState("");
      const handleChange = (evt) => {
            showAlert(false)
            setText(evt.target.value)
      }
      const handleSubmit = (evt) => {
            evt.preventDefault();
            setTodo(text);
            setText("")
      }
      return (
            <><Box sx={{ display: 'flex' }}>
                  <AddIcon sx={{ p: 2 }} size="large" color="primary"></AddIcon>


                  <form onSubmit={handleSubmit}>
                        <TextField value={text}
                              onChange={handleChange}
                              id="outlined-basic"
                              label="Add a Todo Item"
                              variant="outlined"
                              InputProps={{
                                    endAdornment: (<InputAdornment position="end">
                                          <IconButton aria-label="create-todo" edge="end" type="submit">

                                                <CreateIcon color="primary" />
                                          </IconButton>
                                    </InputAdornment>),

                              }}></TextField >
                  </form>
            </Box>
            </>
      )

}