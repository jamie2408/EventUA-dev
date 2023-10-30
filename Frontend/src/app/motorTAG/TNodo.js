import { mat4, vec3 } from "gl-matrix";
import { multiply } from "mathjs";
export default class TNodo {
    constructor(nombre) {
        //atributos para el arbol y la entidad
        this.nombre = nombre;
        this.entidad = null;
        this.padre = null;
        this.hijos = [];

        //atributos para las transformaciones
        this.traslacion = [0, 0, 0];
        this.rotacion = [0, 0, 0];
        this.escalado = [1, 1, 1];
        this.matrizTrans = new mat4.create();
        this.actualizado = false;

        //aux
        this.m = mat4.create();
        this.mRot = mat4.create();

        this.cont = 0;
    }

    //metodos para el arbol y la entidad
    addHijo(nodoHijo) {
        nodoHijo.padre = this;
        this.hijos.push(nodoHijo);
    }

    removeHijo(nodoHijo) {
        for (let i = 0; i < this.hijos.length; i++) {
            if (this.hijos[i].nombre == nodoHijo.nombre) {
                nodoHijo.padre = null;
                //console.log("Nodo borrado: "+this.hijos[i].nombre);
                this.hijos.splice(i, 1);
            }
        }
    }

    setEntidad(nEntidad) {
        this.entidad = nEntidad;
    }

    getEntidad() {
        return this.entidad;
    }

    getPadre() {
        return this.padre;
    }

    recorrer(matAcum, camara, luz, dibujarTexturas, listaeventos, rotacionpins) {
        if (this.actualizado) {
            mat4.multiply(this.matrizTrans, this.calcularMatrizTransf(), matAcum);
        }
        if (this.entidad != null) {
            this.entidad.dibujar(this.matrizTrans, camara, luz, dibujarTexturas, listaeventos, rotacionpins);
        }

        if (this.hijos.length > 0) {
            this.hijos.forEach((hijo) => {
                hijo.recorrer(this.matrizTrans, camara, luz, dibujarTexturas, listaeventos, rotacionpins);
            });
        }
    }

    //Metodos para las transformaciones

    calcularMatrizTransf() {
        this.actualizado = false;
        // mRot almacena la matriz de rotacion
        mat4.multiply(
            this.mRot,
            this.getMatRot(this.rotacion[1], [0, 1, 0]),
            this.getMatRot(this.rotacion[0], [1, 0, 0])
        );
        mat4.multiply(
            this.mRot,
            this.getMatRot(this.rotacion[2], [0, 0, 1]),
            this.mRot
        );

        mat4.multiply(this.m, this.mRot, this.getMatEsc(this.escalado));
        // aplicamos la traslacion y actualizamos la matriz de transformacion

        this.setMatrizTransf(
            mat4.multiply(this.m, this.getMatTras(this.traslacion), this.m)
        );
    }

    multiplicarMatrices(vec, mat) {
        var maux = [];
        let num = 0;

        //se crea la matrix fila a fila
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(mat[num + i]);
                num += 4;
            }
            num = 0;
            maux.push(row);
        }
        //se obtiene el vector por el que se multiplica
        var vector = [vec[0], vec[1], vec[2], 1];
        var res = multiply(maux, vector);
        return res;
    }

    setTraslacion(vecTras) {
        this.traslacion = vecTras;
    }

    setRotacion(vecRot) {
        this.rotacion = vecRot;
    }

    setEscalado(vecEsc) {
        this.escalado = vecEsc;
    }

    trasladar(nTras) {
        //obtener los valores del vector
        var vecTras = vec3.fromValues(nTras[0], nTras[1], nTras[2]);
        //obtener matriz traslacion
        var matriz = this.getMatTras(vecTras);

        var nvecTras = this.multiplicarMatrices(this.traslacion, matriz);
        this.setTraslacion(vec3.fromValues(nvecTras[0], nvecTras[1], nvecTras[2]));

        this.calcularMatrizTransf();

        //queda hacer la matriz de transformacion
    }

    getMatTras(vector) {
        var mat = mat4.create();
        mat4.translate(mat, mat, vector);
        return mat;
    }

    rotar(angulo, eje) {
        if (eje[0] === 1) {
            this.rotacion[0] = angulo;
        } else if (eje[1] === 1) {
            this.rotacion[1] = angulo;
        } else {
            this.rotacion[2] = angulo;
        }

        this.calcularMatrizTransf();
    }

    getMatRot(angulo, eje) {
        const m = mat4.create();
        const pi = Math.PI;
        const degrees = angulo * (pi / 180);

        mat4.rotate(m, m, degrees, eje);
        return m;
    }

    escalar(nEsc) {
        var vecEsc = vec3.fromValues(nEsc[0], nEsc[1], nEsc[2]);
        var matriz = this.getMatEsc(vecEsc);

        var nVecEsc = this.multiplicarMatrices(this.escalado, matriz);
        this.setEscalado(nVecEsc);
        this.calcularMatrizTransf();
    }

    getMatEsc(vector) {
        var mat = mat4.create();
        mat4.scale(mat, mat, vector);
        return mat;
    }

    getTraslacion() {
        return this.traslacion;
    }

    getRotacion() {
        return this.rotacion;
    }

    getEscalado() {
        return this.escalado;
    }

    setMatrizTransf(nMat) {
        this.matrizTrans = nMat;
    }

    getMatrizTransf() {
        return this.matrizTrans;
    }
}