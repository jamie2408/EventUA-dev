export default class TEntidad {
  constructor(nombre) {
    this.nombre = nombre;
    //console.log("Nombre de esta entidad: "+this.nombre);
  }

  dibujar() {
    throw new Error(
      "Implementa este método en las clases que hereden de Entidad"
    );
  }
}
