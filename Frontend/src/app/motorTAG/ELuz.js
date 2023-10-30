import Entidad from "./TEntidad.js";
export default class ELuz extends Entidad {
  constructor(nombre, color, intensidad, pos) {
    super(nombre);
    this.color = color;
    this.intensidad = intensidad;
    this.posicion=pos;
  }

  setIntensidad(vec) {
    this.intensidad = vec;
  }
  getIntensidad() {
    return this.intensidad;
  }

  setColor(vec) {
    this.color = vec;
  }
  getColor() {
    return this.color;
  }

  setPosicion(pos){
    this.posicion=pos;
  }

  getPosicion(){
    return this.posicion;
  }

  dibujar() {
  }
}
