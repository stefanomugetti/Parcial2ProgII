import crearTabla from "./tablaDinamica.js";
import Anuncio_BienesRaices from "./bienesraices.anuncio.js";

const url = "http://localhost:3000/anuncios";

//#region CARGA DE DATOS


// SETEO MAXIMO ID
setMaxId();

function setMaxId(){
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        var max = 0;
        anuncios.forEach((anuncios) => {
          if (anuncios.id > max) {
            max = anuncios.id;
          }
        });
        const UltimoId = max;
        if(parseInt(UltimoId) > 0)
        localStorage.setItem("IdMax", (UltimoId + 1).toString());
        else{
          localStorage.setItem("IdMax", (0).toString());
        }
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    }
  });
  xhr.open("GET", url,true);
  xhr.setRequestHeader('Content-type','application/json;charset=utf8');
  xhr.send();
}
   
//#endregion
//#region AGREGAR

const $frmAnuncio = document.forms[0];

  $frmAnuncio.addEventListener("submit", (e) => {
    const frm = e.target;
    e.preventDefault();
  
    let titulo = frm.txtTitulo.value;
    let descripcion = frm.txtDescripcion.value;
    let precio = parseFloat(frm.txtPrecio.value);
    let cantAutos = parseInt(frm.txtCantAutos.value);
    let dormitorios = parseInt(frm.txtCantDormitorios.value);
    let cantBaños = parseInt(frm.txtCantBaños.value);
  
    let transaccionInt = "Alquiler";
    if (document.formulario.transaccion[0].checked) {
      transaccionInt = "Venta";
    }
    if (precio > 0 && cantAutos > 0 && cantBaños > 0 && dormitorios > 0) {
      const xhr = new XMLHttpRequest();

      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            alert('El anuncio fue agregado');
          } else {
            alert('El anuncio no fue agregado. Error en la solicitud al servidor.');
          }
          eliminarSpinner();
        } else {
          cargarSpinner();
        }
      });
      let idMax = parseInt(localStorage.getItem("IdMax"));
      let newAnuncio = new Anuncio_BienesRaices(
        idMax,
        titulo,
        transaccionInt,
        descripcion,
        precio,
        cantBaños,
        dormitorios,
        cantAutos
      );
      localStorage.setItem("IdMax", idMax + 1);
     // mostrarSpinner(3000);
      xhr.open("POST", url);
      xhr.setRequestHeader('Content-type','application/json;charset=utf8');
      xhr.send(JSON.stringify(newAnuncio));
    }
    else{
      swal("Atencion","Los valores numericos deben ser mayores a 0.","error");
    }
  });
//#region MAPEO

function MapearObjetoAControl(id) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        anuncios.forEach((element) => {
          if (element.id == id) {
            document.getElementById("txtTitulo").value = element.titulo;
            document.getElementById("txtDescripcion").value = element.descripcion;
            document.getElementById("txtPrecio").value = element.precio;
            document.getElementById("txtCantAutos").value = element.cantAutos;
            document.getElementById("txtCantBaños").value = element.cantBaños;
            document.getElementById("txtCantDormitorios").value = element.cantDormitorios;
            document.formulario.transaccion[0].checked = true;
            if (element.transaccion == "Alquiler") {
              document.formulario.transaccion[1].checked = true;
            }
            localStorage.setItem("Id", id);
            return;
          }
      });
      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    }
    
  });
  xhr.open("GET", url,true);
  xhr.setRequestHeader('Content-type','application/json;charset=utf8');
  xhr.send();

}

//#endregion
//#region FUNCIONALIDAD TABLA
const botones = document.getElementById("botonera");
document.getElementById("table-container").addEventListener("click", (e) => {
  if (e.target.matches("tr td")) {
    MapearObjetoAControl(e.target.parentElement.dataset.id);
    botones.removeAttribute("Hidden");
  }
});
function allAnunciosToTable() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const anuncios = JSON.parse(xhr.responseText);
          limpiarTabla();
          document.querySelector(".table-container").appendChild(crearTabla(anuncios));
          document.querySelector(".table-container").removeAttribute('Hidden');
        } else {
          console.error('No hay datos en db.json');
        }
        eliminarSpinner();
      } else {
        cargarSpinner();
      }
    });
  
    xhr.open("GET", url,true);
    xhr.setRequestHeader('Content-type','application/json;charset=utf8');
    xhr.send();
}

function cargarTablaCustom(array) {
  document.querySelector(".table-container").firstElementChild.remove();
  document.querySelector(".table-container").appendChild(crearTabla(array));
}

function limpiarTabla(){
  const container = document.querySelector(".table-container");

  while(container.children.length > 0) // si tiene elementos hijos, los borra
  { 
      container.removeChild(container.firstElementChild);
  }
}

function arrayToTable(array){
  document.querySelector(".table-container").appendChild(crearTabla(array));
}

function limpiarFormulario() {
  //SIEMPRE QUE OCURRA ALGUNA ACCION DEL ABM SE VA A LIMPIAR LOS CAMPOS Y DESAPARECE LA BOTONERA
  const botones = document.getElementById("botonera");
  botones.setAttribute("Hidden", true);

  document.getElementById("txtTitulo").value = "";
  document.getElementById("txtDescripcion").value = "";
  document.getElementById("txtPrecio").value = "";
  document.getElementById("txtCantAutos").value = "";
  document.getElementById("txtCantBaños").value = "";
  document.getElementById("txtCantDormitorios").value = "";

}
//#endregion
//#region CANCELAR
let btnCancelar = document.getElementById("btnCancelar");
btnCancelar.addEventListener("click", (e) => {
  cancelar();
});
function cancelar() {
  limpiarFormulario();
  localStorage.removeItem("Id");
}
//#endregion
//#region ELIMINAR
let btnEliminar = document.getElementById("btnEliminar");

btnEliminar.addEventListener("click", (e) => {
  swal({
    title: "¿Esta Seguro?",
    text: "No podra recuperar el anuncio",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      eliminar();
    }
  });
});

function eliminar() {
  let id = localStorage.getItem("Id");
  if(!parseInt(id) > 0){
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        alert('El anuncio fue eliminado');
      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    } 
  });
      xhr.open("DELETE", url + '/' + id,true);
      xhr.setRequestHeader('Content-type','application/json;charset=utf8');
      xhr.send(null);
      //return true;
}

//#endregion
//#region Modificar
let btnModificar = document.getElementById("btnModificar");

btnModificar.addEventListener("click", (e) => {
  modificar();
});

function modificar() {
  let id = localStorage.getItem("Id");
  if(!parseInt(id) > 0){
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncio = JSON.parse(xhr.responseText);
        modificarAnuncio(anuncio)
          .then(() => {
            alert('Anuncio modificado');
            eliminarSpinner();
          })
          .catch(() => {
            alert("Error, Datos invalidos.");
          });
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    } else {
      cargarSpinner();
    } 
  });
  xhr.open("GET", url + '/' + id,true);
  xhr.setRequestHeader('Content-type','application/json;charset=utf8');
  xhr.send();
}

function modificarAnuncio(anuncio) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let titulo = document.getElementById("txtTitulo").value;
      let descripcion = document.getElementById("txtDescripcion").value;
      let precio = document.getElementById("txtPrecio").value;
      let cantBaños = document.getElementById("txtCantBaños").value;
      let cantAutos = document.getElementById("txtCantAutos").value;
      let dormitorios = document.getElementById("txtCantDormitorios").value;
      let transaccion = "Alquiler";
      if (document.formulario.transaccion[0].checked) {
        transaccion = "Venta";
      }
      if (precio > 0 && cantBaños > 0 && dormitorios > 0 && cantAutos > 0) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              console.log('El anuncio ya fue modificado!');
            } else {
              console.error(xhr.status, xhr.statusText);
            }
            eliminarSpinner();
          } else {
            cargarSpinner();
          }
        });
        anuncio.titulo = titulo;
        anuncio.descripcion = descripcion;
        anuncio.precio = precio;
        anuncio.cantBaños = cantBaños;
        anuncio.cantAutos = cantAutos;
        anuncio.cantDormitorios = dormitorios;
        anuncio.transaccion = transaccion;
        xhr.open("PUT", url + '/' + anuncio.id, true);
        xhr.setRequestHeader('Content-type','application/json;charset=utf8');
        xhr.send(JSON.stringify(anuncio));
        resolve(true);
      }
      reject(false);
    }, 1500);
  });
}
//#endregion


cargarPromedioInicial();
function cargarPromedioInicial(){
  const txtPromedio = document.getElementById("txtPromedio");
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        if(!anuncios.length > 0){
          console.error('No hay datos en la db');
          return;
        }
        let total = 0;
          anuncios.map(({precio}) => total += parseInt(precio));
          const resultado = total / anuncios.length;
          txtPromedio.value = parseInt(resultado);
      } else {
        console.error(xhr.status, xhr.statusText);
      }
    } else {
    } 
  });
      xhr.open("GET", url,false);
      xhr.setRequestHeader('Content-type','application/json;charset=utf8');
      xhr.send();


}



const btnBuscar = document.getElementById("btnBuscar");
btnBuscar.addEventListener('click',(e)=>{
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        const anuncios = JSON.parse(xhr.responseText);
        if(!anuncios.length > 0){
          console.error('No hay datos en la db');
          return;
        }

        var transaccion = document.getElementById("cmbTransaccion");
        var txtPromedio = document.getElementById("txtPromedio");
        let total = 0;
        if(transaccion.value == 'Todo'){
          anuncios.map(({precio}) => total += parseInt(precio));
          const resultado = total / anuncios.length;
          cargarTablaCustom(anuncios);
          if(parseInt(resultado) > 0)
          txtPromedio.value = parseInt(resultado);
          else
          txtPromedio.value = 0;
        }
        else if(transaccion.value == 'Venta'){
          let anunciosVentas = anuncios.filter((element => element.transaccion == 'Venta'));
          anunciosVentas.map(({precio}) => total += parseInt(precio));
          const resultado = total / anunciosVentas.length;
          cargarTablaCustom(anunciosVentas);
          if(parseInt(resultado) > 0)
          txtPromedio.value = parseInt(resultado);
          else
          txtPromedio.value = 0;
        }
        else if(transaccion.value == 'Alquiler'){
          let anunciosAlquiler = anuncios.filter((element => element.transaccion == 'Alquiler'));
          let suma = anunciosAlquiler.reduce((suma, element) => suma + parseInt (element.precio),0);
          anunciosAlquiler.map(({precio}) => total += parseInt(precio));
          const resultado = total / anunciosAlquiler.length;  
          cargarTablaCustom(anunciosAlquiler);
          if(parseInt(resultado) > 0)
          txtPromedio.value = parseInt(resultado);
          else
          txtPromedio.value = 0;
        }

      } else {
        console.error(xhr.status, xhr.statusText);
      }
      eliminarSpinner();
    } else {
      cargarSpinner();
    } 
  });
      xhr.open("GET", url,true);
      xhr.setRequestHeader('Content-type','application/json;charset=utf8');
      xhr.send();


  
});

function getAnunciosVentas(){
  const filter = anuncios.filter((element => element.transaccion == 'Venta'));
  return filter;
}
function getAnunciosAlquiler(){
  const filter = anuncios.filter((element => element.transaccion == 'Alquiler'));
  return filter;
}
   let cajasCheck = document.querySelectorAll(".checkbox-table");
   const tablaCreadaDinamicamente = document.getElementById("table-container");
   cajasCheck.forEach(checkbox => 
   {
       checkbox.addEventListener("click",(e) => 
       {  
           if(tablaCreadaDinamicamente != null)
           {
               let arrayCheckboxes = document.querySelector(".container-checkbox-campos-tabla").querySelectorAll("input");              
   
               let valueRecibido;
               let estaChequeado;
   
               for (let i = 0; i < 7; i++) 
               {
                   estaChequeado = arrayCheckboxes[i].checked;
                   valueRecibido =  arrayCheckboxes[i].value;
                   columnas(valueRecibido,estaChequeado);
               }       
           }        
       });
   });
   
   function columnas(valueRecibido, estaChequeado)
   {
       let trsHeader = tablaCreadaDinamicamente.querySelector("thead").querySelectorAll("tr");
   
       if (estaChequeado)
       {
           trsHeader[0].querySelectorAll("th")[valueRecibido].removeAttribute("Hidden");
       }
       else
       {
           trsHeader[0].querySelectorAll("th")[valueRecibido].setAttribute("Hidden", true);
       }
       let trs = tablaCreadaDinamicamente.querySelector("tbody").querySelectorAll("tr"); 
       
       for (let i = 0; i < trs.length; i++) 
       {  
           if (estaChequeado)
           {
               trs[i].querySelectorAll("td")[valueRecibido].removeAttribute("Hidden");
           }
           else
           {
               trs[i].querySelectorAll("td")[valueRecibido].setAttribute("Hidden", true);
           }
       }
   }


function PromedioTotal(){
  let total = 0
  anuncios.map(({precio}) => total+=parseInt(precio));

const resultado = total / anuncios.length;
}


const cargarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");
  // const divFiltros = document.getElementById('divFiltros');
  // divFiltros.setAttribute("Hidden",true);
  if (!divSpinner.hasChildNodes()) {
    const spinner = document.createElement("img");
    spinner.setAttribute("src", "./assets/spinner.gif");
    spinner.setAttribute("alt", "icono spinner");
    divSpinner.appendChild(spinner);
  }
};

const eliminarSpinner = () => {
  const divSpinner = document.querySelector(".spinner");
  // const divFiltros = document.getElementById('divFiltros');
  // divFiltros.removeAttribute("Hidden");
  while (divSpinner.hasChildNodes()) {
    divSpinner.removeChild(divSpinner.firstChild);
  }
};

allAnunciosToTable();
