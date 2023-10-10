// write your code here
const ramenMenu = document.getElementById("ramen-menu")
const form = document.getElementById('new-ramen')

const displayHeader = () => {
    fetch("http://localhost:3000/ramens")
    .then(resp => resp.json())
    .then(data => {
        data.forEach(ramen => {
            renderRamen(ramen)
        })
    })
}

const renderRamen = ramen => {
    const ramenImg = document.createElement("img")
    const ramenDiv = document.createElement("div")

    ramenImg.src = ramen.image
    ramenImg.alt = "photo of ramen"
    ramenImg.addEventListener("click",()=>{
        const detailImg = document.querySelector('.detail-image')
        detailImg.src = ramen.image

        const detailName = document.querySelector('.name')
        detailName.textContent = ramen.name

        const restaurant = document.querySelector('.restaurant')
        restaurant.textContent = ramen.restaurant

        const rating = document.getElementById('rating-display')
        rating.textContent = ramen.rating

        const comment = document.getElementById('comment-display')
        comment.textContent = ramen.comment
    })

    ramenDiv.appendChild(ramenImg)
    ramenMenu.appendChild(ramenDiv)
}

const createRamen = () => {
    const newRamen = {
        "id": 0,
        "name": form.name.value,
        "restaurant": form.restaurant.value,
        "image": form.image.value,
        "rating": form.rating.value,
        "comment": form['new-comment'].value
      }
    renderRamen(newRamen)
}

form.addEventListener('submit',e=>{
    e.preventDefault()
    createRamen()
    form.reset()
})
displayHeader()