const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');
const messages = [];
let userList = [];

app.use(express.static(path.join(__dirname, '/client')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});
app.use((req, res) => {
  res.status(404).send('404 not found...');
})

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
}); 
const io = socket(server);
io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
socket.on('message', (message) => {
  console.log('Oh, I\'ve got something from ' + socket.id);
  messages.push(message);
  socket.broadcast.emit('message', message);
});
socket.on('join', ({user}) => {
  console.log('User' + user + 'was join.');
  userList.push({user: user, id: socket.id});
  socket.broadcast.emit('newUser',{user: user});
  console.table(userList);
});
socket.on('disconnect', () => { 
  console.log('Oh, socket ' + socket.id + ' has left') 
  userList = userList.filter(item => {
    if(item.id === socket.id){
      socket.broadcast.emit('left', {user: item.user});
      return false;
    } else {
      return true;
    };
  });
  console.table(userList);
});
  console.log('I\'ve added a listener on message and disconnect events \n');
});

