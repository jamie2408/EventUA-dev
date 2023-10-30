import Entidad from "./TEntidad.js";
export default class EMalla extends Entidad {
    constructor(nombre, gestRecursos, nomtex) {
        super(nombre);
        this.gestorRecursos = gestRecursos;
        this.cargarMalla(nombre, nomtex);
    }

    cargarMalla(nom, nomtex) {
        var recMalla = this.gestorRecursos.getRecurso(nom, "malla");
        if (recMalla !== undefined) {
            this.malla = recMalla;
            if (nomtex !== undefined && nomtex !== null) {
                recMalla.setTextura(this.gestorRecursos.getRecurso(nomtex, "textura"));
            }
            return true;
        }
        return false;
    }

    dibujar(mat, camara, luz, dibujarTexturas, listaeventos, rotacionpins) {
        this.malla.dibujar(mat, camara, luz, dibujarTexturas, listaeventos, rotacionpins);
    }
}
