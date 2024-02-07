const socket = io()

async function traeLista() {
    return await fetch('http://localhost:8080/api/products')
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson})
}
async function caller() {
    let productos = await this.traeLista()
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        let { id, title, description, price, thumbnail, code, status } = producto
        document.getElementById("productList").insertAdjacentHTML('beforeend', `<li>${id} - ${title} - ${description} - ${price} - ${thumbnail} - ${code} - ${status}</li>`)
    }
}
window.onload = caller()