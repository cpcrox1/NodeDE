      
  var socket = io();
  var form = document.getElementById('form');
  var input = document.getElementById('input');        
  var nickName = "";
  var typingUsers = [];

  var typingTimeout;

  //asks the user for a nickname when they request to change their nickname.
  function promptNickName(promptMessage){

      if(!promptMessage){
          promptMessage = "please enter your nickname";
      }            
      let newNickName = window.prompt(promptMessage, nickName);

      if(newNickName){
          nickName = newNickName;                
      }
      else if(newNickName == ""){
          promptNickName("nickname cannot be blank");
      }else if (nickName){
          promptNickName("You must enter a nickname before you can chat");
      }    
  }

  //displays messages when a new message is recieved
  function UpdateMessages(msg, messageNickname){
      var item = document.createElement('li');
      if(!messageNickname){
          messageNickname = "annon";
      }
      item.textContent = messageNickname + " says: \n " +msg;
      
      messages.appendChild(item);        
      
      window.scrollTo(0, document.body.scrollHeight);
  }

  //show a user is typing to other users
  function showTyping(){
      if(!nickName){
          nickName = "annon";
      }

      window.clearTimeout(typingTimeout);
      typingTimeout = setTimeout(function(){socket.emit("stop typing", nickName); },2000);

      socket.emit("typing", nickName);
  }

  //adds to a list of users who are currently typing and updates the html element to show a list of those tpying 
  function typingListUpdate(){
      var userTypingString = "";
      console.log(typingUsers);
      for (const val of typingUsers){
          if(userTypingString !=""){
              userTypingString += ", ";
          }
          userTypingString += val;
      }

      if(userTypingString){
          if(typingUsers.length <2 ){
              userTypingString += " is typing";
          } else{
              userTypingString += " are typing";
          }          
      }
      typing.innerHTML = userTypingString;       
  }
  

  //submit a new message to the socket and updates the users messages locally.
  form.addEventListener('submit', function(e) {            
     
      socket.emit("stop typing", nickName);

      e.preventDefault();

      if (input.value) {             
      UpdateMessages(input.value, "you");

      
      socket.emit('chat message', input.value, nickName);
      input.value = '';
      
      }
  });
  

  document.getElementById("changeNickname").addEventListener('click', function(e) {            
      e.preventDefault();
      promptNickName();
      
  });

  //sends the users message and nickname to the index.js to be sent to other users.
  socket.on('chat message', function(msg, messageNickname){
      UpdateMessages(msg, messageNickname);            
  });

  //adds a user to the list of users who are typing.
  socket.on("typing", function(user){
      for (const val of typingUsers){
          if(val == user){
              return;
          }
      }
      typingUsers.push(user);
      typingListUpdate()
  });   
  
  //when a user stops typing this updates the list of users who are typing
  socket.on("stop typing", function(user){
      const result = typingUsers.filter(function(x){
          return x!== user;
      });

      typingUsers = result;
      typingListUpdate()
  });  
