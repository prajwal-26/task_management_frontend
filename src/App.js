import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:3001/api/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const handleDelete = (taskId) => {
    fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => fetchTasks())
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleEdit = (taskId, newTitle, newDescription) => {
    fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    })
      .then(() => fetchTasks())
      .catch((error) => console.error('Error updating task:', error));
  };

  const handleAdd = (taskData) => {
    console.log('Adding task:', taskData);

    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then(() => {
        console.log('Task added successfully.');
        setNewTask('');
        setNewDescription('');
        fetchTasks();
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleAddWithoutDescription = () => {
    handleAdd({ title: newTask, description: newDescription, completed: false });
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Task Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Add New Task
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    label="Task Title"
                    fullWidth
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label="Task Description"
                    fullWidth
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddWithoutDescription}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: '20px' }}>
              <Typography variant="h6" gutterBottom>
                Task List
              </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText primary={task.title} />
                    <ListItemText secondary={task.description} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          const newTitle = prompt('Enter new task title:');
                          const newDescription = prompt('Enter new task description:');
                          if (newTitle) handleEdit(task.id, newTitle, newDescription);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Task;

