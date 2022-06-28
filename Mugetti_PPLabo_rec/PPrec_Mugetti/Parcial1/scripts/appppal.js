import Anuncio_Auto from "./bienesraices.anuncio.js";
const url = "http://localhost:3000/anuncios";

  
  //,caracteristicas
function armarAnuncios(
  transaccion,
  titulo,
  descripcion,
  precio,
  cantBaños,
  cantAutos,
  cantDormitorios
) {
  const card = document.createElement("div");
  card.classList.add("card");
  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  const h1 = document.createElement("h2");
  h1.classList.add("card-title");
  h1.textContent = titulo.toUpperCase();

  const divDescripcion = document.createElement("card--descripcion");
  divDescripcion.classList.add("card-text");
  divDescripcion.textContent = descripcion;
  divDescripcion.appendChild(document.createElement("br"));

  const divPrecio = document.createElement("card--precio");
  divPrecio.classList.add("card-text");
  divPrecio.textContent = "Precio: $" + precio.toString();
  divPrecio.appendChild(document.createElement("br"));

  const divBaños = document.createElement("card--cantBaños");
  divBaños.classList.add("card-text");
  divBaños.textContent = "Cant. Baños: " + cantBaños.toString();
  divBaños.appendChild(document.createElement("br"));

  const divAutos = document.createElement("card--cantAutos");
  divAutos.classList.add("card-text");
  divAutos.textContent = "Cant. Autos: " + cantAutos.toString();
  divAutos.appendChild(document.createElement("br"));

  const divDormitorios = document.createElement("card--cantDormitorios");
  divDormitorios.classList.add("card-text");
  divDormitorios.textContent = "Dormitorios : " + cantDormitorios.toString();
  divDormitorios.appendChild(document.createElement("br"));

  const divTransaccion = document.createElement("card--transaccion");
  divTransaccion.classList.add("card-text");
  divTransaccion.textContent = transaccion;
  divTransaccion.appendChild(document.createElement("br"));

  const divBtn = document.createElement("button");
  divBtn.classList.add("card-button");
  divBtn.textContent = "Ver vehiculo";
  divBtn.appendChild(document.createElement("br"));

  cardHeader.appendChild(h1);
  card.appendChild(divTransaccion);
  card.appendChild(cardHeader);
  card.appendChild(divDescripcion);
  card.appendChild(divPrecio);
  card.appendChild(divBaños);
  card.appendChild(divAutos);
  card.appendChild(divDormitorios);
  card.appendChild(divBtn);

  return card;
}

  cargarAnuncios();

  function cargarAnuncios(){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const anuncios = JSON.parse(xhr.responseText);
          if (!anuncios.length > 0)
            console.error("No hay anuncios!");

          anuncios.forEach((element) => {
            document
              .getElementById("Container")
              .appendChild(
                armarAnuncios(
                  element.transaccion.toUpperCase(),
                  element.titulo,
                  element.descripcion,
                  element.precio,
                  element.cantBaños,
                  element.cantAutos,
                  element.cantDormitorios
                )
              );
          });
        } else {
          console.error(xhr.status, xhr.statusText);
        }
      }
    });
    xhr.open("GET", url,true);
    xhr.setRequestHeader('Content-type','application/json;charset=utf8');
    xhr.send();
  }