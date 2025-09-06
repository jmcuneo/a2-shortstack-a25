const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

// const appdata = [
//   { "model": "toyota", "year": 1999, "mpg": 23 },
//   { "model": "honda", "year": 2004, "mpg": 30 },
//   { "model": "ford", "year": 1987, "mpg": 14}
// ]

let appdata = []

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response )
  }else if( request.method === "DELETE" ){
    handleDelete( request, response )
  }else if( request.method === "PUT" ){
    handleUpdate( request, response )
  }
})

// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 )
//
//   if( request.url === "/" ) {
//     sendFile( response, "public/index.html" )
//   }else{
//       sendFile( response, filename )
//   }
// }

const handleGet = function(request, response) {
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/getTable") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata)); // send whole array
  } else {
    const filename = dir + request.url.slice(1);
    sendFile(response, filename);
  }
};

const handleUpdate = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
    dataString += data;
  });

  request.on("end", function() {
    let parsed = JSON.parse(dataString);
    appdata = appdata.map(item => {
      const obj = JSON.parse(item);

      // match the original todo
      if (
          obj.todo === parsed.original.todo &&
          obj.creationDate === parsed.original.creationDate &&
          obj.deadlineDate === parsed.original.deadlineDate
      ) {
        // replace with the updated todo
        return JSON.stringify(parsed.updated);
      }

      return item; // leave unchanged
    });

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  });
};


// const handleGet = function(request, response) {
//   const filename = dir + request.url.slice(1);
//   console.log(filename)
//   if (request.url === "/") {
//     sendFile(response, "public/index.html");
//   } else if (request.url === "/getTable") {
//     // Send the appdata array back as JSON
//     response.writeHead(200, { "Content-Type": "application/json" });
//     response.end(JSON.stringify(appdata));
//   } else {
//     sendFile(response, filename);
//   }
// };


const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data
  })

  request.on( "end", function() {
    console.log( JSON.parse( dataString ))
    appdata.push(dataString)
    console.log("hi" + appdata)

    //updateTable(appdata)

    response.writeHead( 200, {"Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function(request, response) {
  let dataString = "";

  request.on("data", function(data) {
     dataString += data;
  });

  request.on("end", function() {
    let parsed = JSON.parse(dataString); // ✅ parse into object
    appdata = appdata.filter(item => {
      return !(
          JSON.parse(item).todo === parsed.todo &&
          JSON.parse(item).creationDate === parsed.creationDate &&
          JSON.parse(item).deadlineDate === parsed.deadlineDate
      );
    });
    console.log(appdata);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(appdata));
  })
}



const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
