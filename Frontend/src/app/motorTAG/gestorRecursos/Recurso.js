export default class Recurso{
    constructor(nombre){
        this.nombre=nombre;
    }
    getNombre(){
        throw new Error('Este metodo se implementa en las clases que heradan de Recurso');
    }
    setNombre(){
        throw new Error('Este metodo se implementa en las clases que heradan de Recurso');
    }
}