let express = require('express');
let app = express();
let httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let connections = [];

io.on('connect' , (socket) => {
   connections.push(socket);
   //here we are sending this data to other connections
   socket.on('draw' , (data) =>{
       connections.forEach(con => {
           if(con.id != socket.id){
               con.emit('ondraw' , {x: data.x, y: data.y});
           }

       });
   });
 
  socket.on('down',(data) => {
      connections.forEach(con => {
          if(con.id != socket.id){
              con.emit('ondown',{x:data.x , y:data.y});
          }
      })
  })

   socket.on('disconnect',() => {
       //it will remove con id which is not equal to socket id
       connections = connections.filter((con) => con.id != socket.id);
   });
});

app.use(express.static("public"));

let PORT = process.env.PORT || 8080;
httpServer.listen(PORT , () => console.log(`server started on port ${PORT}`));
