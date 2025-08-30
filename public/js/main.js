// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    //retrieves the elements of the form
    const firstName = document.getElementById( "firstName" )
    const lastName = document.getElementById( "lastName" )
    const address = document.getElementById( "address" )
    const shirts = document.getElementById( "shirts" )
    const jackets = document.getElementById( "jackets" )
    const hats = document.getElementById( "hats" )

    if(firstName && lastName && address && shirts && jackets && hats){
        //creates a json with the information contained within the form
        const json = {firstName: firstName.value, lastName: lastName.value, address: address.value, shirts:shirts.value, jackets:jackets.value, hats:hats.value};
        const body = JSON.stringify(json);
        //sends a post request to the server
        const response = await fetch( "/submit", {
            method:"POST",
            body
        })

        const text = await response.text()
        const msg = document.getElementById( "response message" ) //gets the response message
        if(response){
            if(response.status === 200) {
                msg.innerHTML = "Received order with information:" + text
                setTimeout(()=>{
                    msg.innerHTML = ""
                },1000)
            }
            else{
                msg.innerHTML = "Something went wrong with order submission"
            }
        }
        console.log( "text:", text )
    }

    else{
        console.log("Error: failed to fetch form elements")
    }

}

window.onload = function() {
   const button = document.querySelector("button");
  button.onclick = submit;
}