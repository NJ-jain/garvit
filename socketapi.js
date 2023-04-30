const io = require( "socket.io" )();
const userModel = require("./routes/users")
var user = [];
var userid = [];
const socketapi = {
    io: io
};



// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    // console.log( user[userid.indexOf(socket.id)] +" connected" );
   

    socket.on('disconnect', () => {
        // console.log( user[userid.indexOf(socket.id)] +" disconnected" );
        user.splice(userid.indexOf(socket.id) , 1);
        userid.splice(userid.indexOf(socket.id), 1);
        console.log(user[userid.indexOf(socket.id)] +  " disconnected" );
        console.log("disconnected")
        io.emit('updateUserList', {data : user , id : userid})
        console.log(user);
     });
     socket.on('msg' ,async function (message){
       
        console.log(message);
        io.emit('msg' , {message , username : user[userid.indexOf(socket.id)]});
        
     })


     socket.on("private message", (msg) => {

         socket.broadcast.emit('private message' , {msg , username : user[userid.indexOf(socket.id)]});
      });
    //  socket.on('naam' , async function(naam){
    //     user.push(naam); 
    //     userid.push(socket.id);
    //     console.log( user[userid.indexOf(socket.id)] +" connected" );
    //     // io.emit('online' , {data : user});
    //     const u = await userModel.find()
    //     console.log(u)
    //     // u.forEach(function(elem) { 
    //     //     if(!user.indexOf(elem.name))
    //     //     {
    //     //         console.log(elem.name +  " is exit")
    //     //     }
    //     // })
        
    //     io.emit('updateUserList', {data : user , id : userid })
    //     console.log(user);
    //     console.log(userid);
    // })

    socket.on('naam' , function(naam){
        user.push(naam); 
        userid.push(socket.id);
        console.log( user[userid.indexOf(socket.id)] +" connected" );
        // io.emit('online' , {data : user});
        io.emit('updateUserList', {data : user , id : userid})
        console.log(user);
        console.log(userid);
    })    
    

    socket.on('create', function(data) {
        console.log("create room")
        console.log(data);
        socket.join(data.room);
        console.log(data.withUserId);
        socket.broadcast.to(data.withUserId).emit("invite",{room:data })
        // io.emit("topnaam"  ,{naam : data.user})
    });

    socket.on('joinRoom', function(data) {
        socket.join(data.room.room);
    });
    socket.on('personalmessage', function(data) {
        // socket.to(data.room).emit('personalmessage', data);
        socket.broadcast.to(data.room).emit('personalmessage', data);

        console.log(data);
    })

});
// end of socket.io logic

module.exports = socketapi;



