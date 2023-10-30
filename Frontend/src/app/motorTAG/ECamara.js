import Entidad from "./TEntidad.js";
import { mat4, glMatrix } from "gl-matrix";
export default class ECamara extends Entidad {
    constructor(nombre, fov, aspecto, near, far) {
        super(nombre);
        this.fov = fov;
        this.aspecto = aspecto;
        this.cercano = near;
        this.lejano = far;

        //auxiliares
        this.matrizProyeccion = mat4.create();
        this.matrizVista = mat4.create();
        mat4.identity(this.matrizVista);
        this.arriba = [0, 1, 0];
        this.direccion = [0, -25, 0];
        this.posicion = [180, 40, 0];
    }
    getPosicion() {
        return this.posicion;
    }
    setCampo(num) {
        this.fov = num;
    }
    getCampo() {
        return this.fov;
    }
    setAspecto(num) {
        this.aspecto = num;
    }
    getAspecto() {
        return this.aspecto;
    }
    setCercano(fl) {
        this.cercano = fl;
    }
    getCercano() {
        return this.cercano;
    }
    setLejano(fl) {
        this.lejano = fl;
    }
    getLejano() {
        return this.lejano;
    }

    getNombre() {
        return this.nombre;
    }
    setNombre(name) {
        this.nombre = name;
    }

    calcularMatrizProyeccion() {
        mat4.perspective(
            this.matrizProyeccion,
            this.fov,
            this.aspecto,
            this.cercano,
            this.lejano
        );
        return this.matrizProyeccion;
    }
    calcularMatrizVista() {
        mat4.lookAt(this.matrizVista, this.posicion, this.direccion, this.arriba);
        return this.matrizVista;
    }
    dibujar() {
    }
}
