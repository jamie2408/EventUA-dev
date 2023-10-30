import RecursoMalla from "./RecursoMalla.js";
import RecursoTextura from "./RecursoTextura.js";
import RecursoShader from "./RecursoShader.js";
import RecursoMaterial from "./RecursoMaterial.js";
export default class gestorRecursos {
    constructor(gl) {
        this.recursos = new Map();
        this.gl = gl;
    }

    getRecurso(nombre, tipo) {
        var recurso = this.recursos.get(nombre[0]);

        //si el recurso no existe (undefined) crearlo
        if (recurso == undefined) {
            //consultar los tipos (malla, shader, textura, etc)
            //pasar a malla, textura y material el gl
            if (tipo == "malla") {
                recurso = new RecursoMalla(nombre, this.gl);
                if (recurso.cargarFichero(nombre)) {
                    this.recursos.set(nombre, recurso);
                }
            } else if (tipo == "textura") {
                recurso = new RecursoTextura(nombre, this.gl);
                if (recurso.cargarFichero(nombre)) {
                    this.recursos.set(nombre[0], recurso);
                }
            }
        }

        //si el recurso ya existe devolverlo
        return recurso;
    }
}
