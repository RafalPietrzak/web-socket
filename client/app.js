const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
let userName = null;
const socket = io({
  autoConnect: true
});
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({user}) => addMessage(
  'Chat Bot', 
  user + ' has joined the conversation!'
));
socket.on('left', ({user}) => addMessage(
  'Chat Bot', 
  user + ' has left the conversation!'
));
const login = (event) => {
  event.preventDefault();
  if(userNameInput.value){
    userName = userNameInput.value;
    socket.emit('join', {user: userName} )
    messagesSection.classList.add('show');
  } else {
    alert('Add name to field');
  }
}; 
function sendMessage(e) {
  e.preventDefault();
  let messageContent = messageContentInput.value;
  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent })
    messageContentInput.value = '';
  }
}
const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  if(author === 'Chat Bot') message.classList.add('message--bot');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

