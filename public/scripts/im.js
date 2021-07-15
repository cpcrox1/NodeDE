      
  var socket = io();
  var form = document.getElementById('form');
  var input = document.getElementById('input');        
  var nickName = "";
  var typingUsers = [];

  var typingTimeout;

  
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

  function UpdateMessages(msg, messageNickname){
      var item = document.createElement('li');
      if(!messageNickname){
          messageNickname = "annon";
      }
      item.textContent = messageNickname + " says: \n " +msg;
      
      messages.appendChild(item);        
      
      window.scrollTo(0, document.body.scrollHeight);
  }

  function showTyping(){
      if(!nickName){
          nickName = "annon";
      }

      window.clearTimeout(typingTimeout);
      typingTimeout = setTimeout(function(){socket.emit("stop typing", nickName); },2000);

      console.log("typing");
      socket.emit("typing", nickName);
  }

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

  

  form.addEventListener('submit', function(e) {            
      console.log("submit new");
      console.log(input.value);

      socket.emit("stop typing", nickName);
      console.log("stop typing because enter");

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

  socket.on('chat message', function(msg, messageNickname){
      UpdateMessages(msg, messageNickname);            
  });

  socket.on("typing", function(user){
      for (const val of typingUsers){
          if(val == user){
              return;
          }
      }
      typingUsers.push(user);
      typingListUpdate()
  });   

  socket.on("stop typing", function(user){

      const result = typingUsers.filter(function(x){
          return x!== user;
      });

      typingUsers = result;
      typingListUpdate()
  });  
