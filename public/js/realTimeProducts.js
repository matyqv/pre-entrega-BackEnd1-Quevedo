const socket = io();

const getUsername = async () => {
  const data = await Swal.fire({
    title: "Ingrese su nombre de usuario",
    input: "text",
    inputLabel: "este nombre se utilizara en el chat",
    allowOutsideClick: false,
    inputValidator: (username) => {
      if (!username) return "Es obligatorio ingresar un nombre de usuario";
    }
  })

  return data.value;
}
/*
const showNewUserConnected = (username) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: `${username} conectado/a`,
    showConfirmButton: false,
    timer: 2000,
  });
}*/

const inicializar = async () => {
  socket.emit("pedir productos");

  socket.on("recibir-productos", (products) => {
    console.log("enviar productos");
    const productList = document.getElementById("lista-productos");
    productList.innerHTML = "";

    products.forEach(({ id, title, description, code, status, price, stock, category }) => {
      productList.innerHTML +=
        `       <li class="card" style="width: 18rem;">

    <div class="card h-100">
    <div class="card-body d-flex flex-column">

        <p class="card-text">ID: ${id}</p>
        <h5 class="card-title">${title}</h5>
        <p class="card-text">CODE: ${code}</p>
        <p class="card-text">STATUS: ${status}</p>
        <p class="card-text">STOCK: ${stock}</p>
        <p class="card-text">CATEGORY: ${category}</p>
        <p class="card-text">PRICE: $${price}</p>
        <p class="card-text">DESCRIPTION: ${description}</p>

        <!-- Botón centrado abajo -->

        <button type="button" class="btn btn-danger mt-auto mx-auto delete-btn" data-id="${id}">Delete</button>
        </div> 
        </div>

                </li>`
    });
  });


  document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const productData = {
      id: "",
      title: document.getElementById("title").value,
      code: document.getElementById("code").value,
      status: document.getElementById("Status").value,
      stock: document.getElementById("stock").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value
    };

    socket.emit("nuevo-producto", productData);

    document.getElementById("form").reset();    // Limpiar formulario
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const productId = event.target.getAttribute("data-id"); 
        socket.emit("eleminar-producto", (productId));
    }
});
}


inicializar();