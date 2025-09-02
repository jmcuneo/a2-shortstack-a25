window.onload = ()=>{
    getTable().then()
}

const getTable = async () => {
    const table = document.getElementById("results")
    //sends a get request for the data stored in the server
    const response = await fetch("/results",
        {
            method: "GET",
        })
    //extracts the data
    const data = await response.json()
    if(data instanceof Array) {
        // console.log(data)
        if(table){
            for(let i=0;i<data.length;i++){
                //creates a new row
                const row = table.insertRow()
                //creates cells in row for all values returned from the server
                row.insertCell().innerHTML = data[i].firstName
                row.insertCell().innerHTML = data[i].lastName
                row.insertCell().innerHTML = data[i].address
                row.insertCell().innerHTML = data[i].shirts
                row.insertCell().innerHTML = data[i].jackets
                row.insertCell().innerHTML = data[i].hats
                row.insertCell().innerHTML = data[i].totalPrice

                const buttonHolder = document.createElement("div");
                buttonHolder.className = "buttonHolder";

                //creates a button that allows for user to access a page that allows for deletion and modification of the row
                const button = document.createElement("button");
                button.innerText = "update"
                button.id = ""+i
                button.onclick = () =>{
                    update(button.id, data[i])
                }


                //gives the delete button its functionality which is to have the server delete the row, and then reload the page
                const del = document.createElement("button");
                del.innerText = "delete"
                del.className = "delete"
                del.onclick = async () => {
                    //creates body for http request
                    const body = JSON.stringify( {
                        "row":i,
                    })
                    //Uses DELETE request to update table
                    await fetch("/results", {
                        method: "DELETE",
                        body: body,
                    }).then((response)=>{
                        // console.log(response)
                        window.location.reload()
                    })
                }

                buttonHolder.appendChild(button)
                buttonHolder.appendChild(del)

                row.insertCell().appendChild(buttonHolder)
            }
        }
    }
}
/*
Sets up the loading for the update menu and changes what is onscreen to reflect the opened menu
*/
const update = (row, data) => {
    //divs
    const main = document.getElementById("first")
    const secondary = document.getElementById("second")
    //buttons
    const save = document.getElementById("save")
    const discard = document.getElementById("discard")
    //fields
    const firstName = document.getElementById("firstName")
    const lastName = document.getElementById("lastName")
    const address = document.getElementById("address")
    const shirts = document.getElementById("shirts")
    const jackets= document.getElementById("jackets")
    const hats = document.getElementById("hats")


    if(main && secondary && save && discard && firstName && lastName && address && shirts && jackets && hats){
        // console.log("now to switch")
        //switches which div is displayed onscreen
        // console.log(data)

        //makes the switch onscreen
        const temp = main.getAttribute("style") //original style
        main.setAttribute("style","display:none")
        secondary.setAttribute("style","display:flex")
        //gives the discard button its functionality, which is to return and discard any changes
        discard.onclick = () =>{
            secondary.setAttribute("style","display:none")
            main.setAttribute("style", temp)
        }
        //sets the fields to their intial values
        /*
        data.firstName
        data.lastName
        data.address
        data.shirts
        data.jackets
        data.hats
         */
        firstName.setAttribute("value",data.firstName)
        lastName.setAttribute("value",data.lastName)
        address.setAttribute("value",data.address)
        shirts.setAttribute("value",data.shirts)
        jackets.setAttribute("value",data.jackets)
        hats.setAttribute("value",data.hats)
        //gives the save button its functionality which is to have the server update the data, and then reloads the page
        save.onclick = async () => {
            //makes it so that the user cannot edit fields while saving
            firstName.disabled = true
            lastName.disabled = true
            address.disabled = true
            shirts.disabled = true
            jackets.disabled = true
            hats.disabled = true
            // console.log(
            // firstName.value,
            // lastName.value,
            // address.value,
            // shirts.value,
            // jackets.value,
            // hats.value)
            //creates body for http request
            const body = JSON.stringify({
                "row": row,
                "data": {
                    "firstName": firstName.value,
                    "lastName": lastName.value,
                    "address": address.value,
                    "shirts": shirts.value,
                    "jackets": jackets.value,
                    "hats": hats.value,
                }

            })
            //Uses PUT request to update table
            await fetch("/results", {
                method: "PUT",
                body: body,
            }).then((response) => {
                // console.log(response)
                window.location.reload()
            })
        }

    }
}



/*
//Experimental function

const update = async (row) => {
    console.log(row)
    //getting two divs that make up the body
    const main = document.getElementById("first")
    const secondary = document.getElementById("second")
    if(main){
        if(secondary) {
            // console.log("now to switch")
            //switches which is displayed
            const temp = main.getAttribute("style") //original style
            main.setAttribute("style","display:none")
            secondary.setAttribute("style","display:flex")
            setTimeout(() => {
                // console.log("now to switch back")
                secondary.setAttribute("style","display:none")
                main.setAttribute("style", temp)
            }, 100)
        }
    }

}

 */