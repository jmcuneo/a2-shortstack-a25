const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000
    //TOTAL PRICE CALCULATION: totalPrice = shirts * 15 + jackets * 35 + hats * 5
const appdata = [
    { "firstName": "John", "lastName": "Doe", "address": "421 Doe Street", "shirts":1,"jackets":0,"hats":1,"totalPrice":20},
    { "firstName": "Kevin", "lastName": "McClain", "address": "321 Johnson Ave", "shirts":2,"jackets":0,"hats":0,"totalPrice":30},
    { "firstName": "Peter", "lastName": "Ohio", "address": "5 Green Boulevard", "shirts":1,"jackets":1,"hats":1,"totalPrice":55}
]
    //This contains the list of properties of the JSON in order to make it easier
const properties = Object.keys(appdata[0])
const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    handleGet( request, response )    
  }else if( request.method === "POST" ){
    handlePost( request, response ) 
  } else if( request.method === "PUT" ){
      if(checkDestination( request, response , "public/results")){
          handlePut( request, response )
          // console.log("handled put request")
      }
      else{
          // console.log("did not handle put request")
          response.writeHead( 400);
          response.end();
      }
  }
  else if( request.method === "DELETE" ){
      if(checkDestination( request, response , "public/results")){
          handleDelete( request, response )
          // console.log("handled delete request")
      }
      else{
          // console.log("did not handle delete request")
          response.writeHead( 400);
          response.end();
      }
  }
})
/*
Checks to make sure the destination is correct for the specified action, and returns true if it is
*/
const checkDestination = ( request, response, destination) => {
    const filename = dir + request.url.slice( 1 );
    //handles the case when the client is updating the appdata
    return filename === destination;
}
/*
Updates the appdata by replacing the row specified in the json with the data specified in the json
 */
const handlePut = ( request, response ) => {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        try {
            let succeed = false; //whether the operation completed as a whole
            const body = JSON.parse(dataString)
            const keys = Object.keys(body)
            // console.log("keys:" + keys)
            //first check to make sure that json is formatted correctly
            if (keys.length === 2) {
                // console.log("passed check 1")
                //second check to make sure that json is formatted correctly
                if (keys[0] === "row" && keys[1] === "data") {
                    // console.log("passed check 2")
                    //extracting values from json
                    const row = parseInt(body[keys[0]])
                    const data = body[keys[1]]
                    // console.log("data:", data)
                    //third check to make sure that json is formatted correctly
                    if (row < appdata.length) {
                        // console.log("passed check 3")
                        //final check to make sure that json is formatted correctly
                        if (correctDataFormat(data)) {
                            // console.log("passed check 4")
                            // console.log("replacing data")
                            //replacing values in appdata and recalculates final price
                            appdata[row].firstName = data.firstName;
                            appdata[row].lastName = data.lastName;
                            appdata[row].address = data.address;
                            appdata[row].shirts = data.shirts;
                            appdata[row].jackets = data.jackets;
                            appdata[row].hats = data.hats;
                            appdata[row].totalPrice = data.shirts * 15 + data.jackets * 35 + data.hats * 5;
                            //sending response indicating operation was successful
                            // console.log(appdata)
                            response.writeHead( 200);
                            response.end()
                            succeed = true;
                        }
                    }
                }
            }
            if(!succeed) {
                response.writeHead(400);
                response.end("ERROR")
            }
        } catch (err) {
            response.writeHead( 400);
            response.end()
        }
    });
}
/*
Updates the appdata by deleting the row specified in the json
 */
const handleDelete = ( request, response ) => {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        try {
            let succeed = false; //whether the operation completed as a whole
            const body = JSON.parse(dataString)
            const keys = Object.keys(body)
            //first check to make sure that json is formatted correctly
            if (keys.length === 1) {
                //second check to make sure that json is formatted correctly
                if (keys[0] === "row") {
                    //extracting values from json
                    const row = parseInt(body[keys[0]])
                    //final check to make sure that json is formatted correctly
                    if (row < appdata.length) {
                        //final check to make sure that json is formatted correctly
                        appdata.splice(row, 1)
                        //sending response indicating operation was successful
                        // console.log(appdata)
                        response.writeHead(200);
                        response.end()
                        succeed = true;
                    }
                }
            }
            if(!succeed) {
                response.writeHead(400);
                response.end()
            }
        } catch (err) {
            response.writeHead(400);
            response.end()
        }
    });
}









const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 
    // console.log(filename)
    if( request.url === "/" ) {
        sendFile( response, "public/index.html" )
    }
    //handles the case when the client is requesting the appdata
    else if( filename === "public/results" ) {
        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end(JSON.stringify(appdata))
    }
    else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
      try {
          // console.log(JSON.parse(dataString))
          data = JSON.parse(dataString)
          if (correctDataFormat(data)) {
              // console.log("DATA OF CORRECT FORMAT!")
              //Calculates the total price based upon the formula given above appdata
              const total = data.shirts * 15 + data.jackets * 35 + data.hats * 5;
              const rtr = {
                  "firstName": data.firstName,
                  "lastName": data.lastName,
                  "address": data.address,
                  "shirts": data.shirts,
                  "jackets": data.jackets,
                  "hats": data.hats,
                  "totalPrice": total,
              }
              appdata.push(rtr)
              response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
              response.end(JSON.stringify(rtr))
          }
          else{
              response.writeHead( 400);
              response.end();
          }
      }
      catch( e ) {
          console.error( e.message );
          response.writeHead( 400);
          response.end();
      }
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

/*
Checks to make sure that the JSON that has been sent has the same properties as the data that the server is storing
 */
const correctDataFormat = (data) => {
    let rtr = false; //return value
    // console.log( data );
    try{
        const keys = Object.keys( data ); //the attributes to be checked
        for ( let i = 0; i < keys.length; i++ ) {
            rtr = false; //resets rtr before each key check
            for( let j = 0; j < properties.length; j++ ) {
                // console.log( keys[ i ] + properties[ j ] );
                if(keys[ i ] === properties[j] ) {
                    //signifies that the key is found in the list of keys for the data
                    rtr = true;
                    break;
                }
            }
            if(!rtr){
                break;
            }

        }
    } catch( e ) {
        //Catches any errors that occur in the checking of the values
        console.error( e.message );
    }
   return rtr;
}

server.listen( process.env.PORT || port )
