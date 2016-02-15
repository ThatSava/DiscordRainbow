var DiscordClient = require('discord.io');
var config = require('./config.json');

var roleID = 0;
var serverID = 0;

//Starts the connection with discord
var bot = new DiscordClient({
    autorun: true,
    email: config.email,
    password: config.password
});

//Gets the serverID
function getServerID(){
  if(serverID == 0) {
      for(var counter in bot.servers){
        if(bot.servers[counter].name == config.server){
          serverID = bot.servers[counter].id;
          return serverID;
        }
      }
  }else{
    return serverID;
  }
}

//Gets the role id
function getRoleID(){
  if(roleID == 0) {
      var sID = getServerID();
      for(var counter in bot.servers[sID].roles){
        if(bot.servers[sID].roles[counter].name == config.role){
          roleID = bot.servers[sID].roles[counter].id;
          return bot.servers[sID].roles[counter].id;
        }
      }
  }else{
    return roleID;
  }
}

//Generates a random html color
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Changes the group's color when called
function changeColor() {
  var color = getRandomColor();
  console.log("Changing the color! If you like this color, you can use it with: " + color);
  bot.editRole({
    server: getServerID(),
    role: getRoleID(),
    color: color
  });
}

//Does the magic
bot.on('ready', function(){
  console.log("The server id is: " + getServerID());
  console.log("The role id is: " + getRoleID());
  if(config.interval == 'message'){
    bot.on('message', function(user, userID, channelID, message, rawEvent){
      for(var num in bot.servers[getServerID()].channels){
        if(bot.servers[getServerID()].channels[num].id == channelID){
          console.log('Recieved a message!');
          changeColor();
        }
      }
    });
  }else{
    setInterval(changeColor, config.interval*1000);
  }
});
