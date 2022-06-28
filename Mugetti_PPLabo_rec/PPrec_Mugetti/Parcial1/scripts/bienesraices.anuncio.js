import {Anuncio}  from "./anuncios.js"; 
class Anuncio_BienesRaices extends Anuncio {
    constructor(id, titulo, transaccion,descripcion, precio, cantBaños,cantAutos,cantDormitorios) {
      super(id,titulo,transaccion,descripcion,precio);
      this.cantBaños = cantBaños;
      this.cantAutos = cantAutos;
      this.cantDormitorios = cantDormitorios;
    }
  }
  
  export default Anuncio_BienesRaices