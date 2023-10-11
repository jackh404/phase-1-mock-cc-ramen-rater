const menu = document.getElementById("ramen-menu")
const form = document.getElementById("new-ramen")
let detailedRamen
let editing = false

//On form submit, either patch if editing or post if creating a new ramen
form.addEventListener("submit", e => {
    e.preventDefault()
    if(editing){
        editRamen()
    } else {
        addRamen()
    }
})

//when cancel button is clicked, ensure form is fully reset
form.addEventListener("reset",()=>{
    if(editing){
        resetForm()
    }
})

//When edit button is clicked, pull currently displayed ramen into form & alter it
//to look like an edit form
document.getElementById("edit").addEventListener("click", e => {
    editing = true
    form.name.value = detailedRamen.name
    form.restaurant.value = detailedRamen.restaurant
    form.image.value = detailedRamen.image
    form.rating.value = detailedRamen.rating
    form['new-comment'].value = detailedRamen.comment
    document.querySelector('input[type="submit"]').value = "Save Changes"
    document.querySelector('form h4').textContent = "Edit Ramen"
})

//When delete button is clicked, send DELETE request for currently displayed ramen
document.getElementById("delete").addEventListener("click",(e)=>{
    fetch(`http://localhost:3000/ramens/${detailedRamen.id}`,{
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
        }
    })
        .then(() => location.reload())
})

//render a single ramen icon and apend it to the menu
const renderRamen = (ramen) => {
    const image = document.createElement("img")
    image.setAttribute("src",ramen.image)
    image.setAttribute("alt",`image of ${ramen.name}`)
    image.addEventListener("click", ()=> showDetail(ramen))

    menu.appendChild(image)
}

//fetch the ramens from the server and loop through rendering them
const fetchRamen = () => {
    fetch("http://localhost:3000/ramens")
    .then(resp => resp.json())
    .then(data => {
        for(ramen of data){
            renderRamen(ramen)
        }
        showDetail(data[0])
    })
}

//pull a clicked ramen from the menu into the detailed display below
const showDetail = (ramen) => {
    detailedRamen = ramen

    const detailImage = document.querySelector(".detail-image")
    detailImage.setAttribute("src",ramen.image)
    detailImage.setAttribute("alt",`Image of ${ramen.name}`)
    
    document.querySelector(".name").textContent = ramen.name
    document.querySelector(".restaurant").textContent = ramen.restaurant
    document.getElementById("rating-display").textContent = ramen.rating
    document.getElementById("comment-display").textContent = ramen.comment
}

//create a JS object from data input in the form
const objectifyForm = () => {
     return {
        "name": form.name.value,
        "restaurant": form.restaurant.value,
        "image": form.image.value,
        "rating": form.rating.value,
        "comment": form['new-comment'].value
    }
}
//add a new ramen to the server and the menu
const addRamen = () => {
    const newRamen = objectifyForm()
    console.log(postConfig(newRamen))
    fetch("http://localhost:3000/ramens",postConfig(newRamen))
        .then(resp => resp.json())
        .then(respRamen => {
            form.reset()
            showDetail(respRamen)
            detailedRamen = respRamen
            console.log(respRamen)
        })
}

//create the config object for a POST request
const postConfig = (obj) => {
    return {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Accept : "application/json"
        },
        body: JSON.stringify(obj)
    }
}

//edit an existing ramen based on what's changed in the form
const editRamen = () => {
    const changedRamen = objectifyForm()
    fetch(`http://localhost:3000/ramens/${detailedRamen.id}`,patchConfig(changedRamen))
        .then(resp => resp.json())
        .then(respRamen => {
            resetForm()
            showDetail(respRamen)
            detailedRamen = respRamen
            console.log(respRamen)
        })
}

//create the config object for a PATCH request
const patchConfig = (obj) => {
    return {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json",
            Accept : "application/json"
        },
        body: JSON.stringify(obj)
    }
}

//clears form fields & resets it to 'add mode'
function resetForm () {
    form.reset()
    editing = false
    document.querySelector('input[type="submit"]').value = "Create"
    document.querySelector('form h4').textContent = "Add New Ramen"
}

//run the initial fetch on page load
fetchRamen()