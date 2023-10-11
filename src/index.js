const menu = document.getElementById("ramen-menu")
const form = document.getElementById("new-ramen")

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    addRamen()
})

const renderRamen = (ramen) => {
    const image = document.createElement("img")
    image.setAttribute("src",ramen.image)
    image.setAttribute("alt",`image of ${ramen.name}`)
    image.addEventListener("click", ()=> showDetail(ramen))

    menu.appendChild(image)
}

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

const showDetail = (ramen) => {
    const detailImage = document.querySelector(".detail-image")
    detailImage.setAttribute("src",ramen.image)
    detailImage.setAttribute("alt",`Image of ${ramen.name}`)
    
    document.querySelector(".name").textContent = ramen.name
    document.querySelector(".restaurant").textContent = ramen.restaurant
    document.getElementById("rating-display").textContent = ramen.rating
    document.getElementById("comment-display").textContent = ramen.comment
}

const addRamen = () => {
    const newRamen = {
      "name": form.name.value,
      "restaurant": form.restaurant.value,
      "image": form.image.value,
      "rating": form.rating.value,
      "comment": form['new-comment'].value
    }
    console.log(postConfig(newRamen))
    fetch("http://localhost:3000/ramens",postConfig(newRamen)).then(form.reset())
}

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

fetchRamen()