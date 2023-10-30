import Recurso from "./Recurso.js";

export default class RecursoTextura extends Recurso {
    constructor(nombre, gl) {
        super(nombre);
        this.img = new Image();
        this.img1 = new Image();
        this.img2 = new Image();
        this.img3 = new Image();
        this.img4 = new Image();
        this.img5 = new Image();
        this.img6 = new Image();

        this.textura = null;
        this.textura1 = null;
        this.textura2 = null;
        this.textura3 = null;
        this.textura4 = null;
        this.textura5 = null;
        this.textura6 = null;

        this.gl = gl;
        this.contadorTexturas = -1;
    }
    getName() {
        return this.nombre;
    }
    setName(nombre) {
        this.nombre = nombre;
    }
    cargarFichero(nombre) {
        const req = new XMLHttpRequest();
        var locFichero = null;
        var locFichero1 = null;
        var locFichero2 = null;
        var locFichero3 = null;
        var locFichero4 = null;
        var locFichero5 = null;
        var locFichero6 = null;


        if (window.location.toString().includes("eventua")) {
            locFichero = "https://eventua.ovh/assets/mallas/" + nombre[0] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero = "http://localhost:4200/assets/mallas/" + nombre[0] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero1 = "https://eventua.ovh/assets/mallas/" + nombre[1] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero1 = "http://localhost:4200/assets/mallas/" + nombre[1] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero2 = "https://eventua.ovh/assets/mallas/" + nombre[2] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero2 = "http://localhost:4200/assets/mallas/" + nombre[2] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero3 = "https://eventua.ovh/assets/mallas/" + nombre[3] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero3 = "http://localhost:4200/assets/mallas/" + nombre[3] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero4 = "https://eventua.ovh/assets/mallas/" + nombre[4] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero4 = "http://localhost:4200/assets/mallas/" + nombre[4] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero5 = "https://eventua.ovh/assets/mallas/" + nombre[5] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero5 = "http://localhost:4200/assets/mallas/" + nombre[5] + ".png";
        }
        if (window.location.toString().includes("eventua")) {
            locFichero6 = "https://eventua.ovh/assets/mallas/" + nombre[6] + ".png";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero6 = "http://localhost:4200/assets/mallas/" + nombre[6] + ".png";
        }

        let recuperado = false;

        req.open("GET", locFichero, false);
        req.onload = function() {
            if (req.status >= 200 && req.status <= 299) {
                //respuesta satisfactoria
                recuperado = true;
            } else {
                recuperado = false;
            }
        };
        req.send();
        if (recuperado) {
            this.img.crossOrigin = "anonymous";
            this.img.src = locFichero;
            this.addTextureIndex();
            this.textura = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img1.crossOrigin = "anonymous";
            this.img1.src = locFichero1;
            this.addTextureIndex();
            // TAG 26 - Gestor de recursos - Recurso Textura
            this.textura1 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura1);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img2.crossOrigin = "anonymous";
            this.img2.src = locFichero2;
            this.addTextureIndex();
            this.textura2 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE2);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura2);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img3.crossOrigin = "anonymous";
            this.img3.src = locFichero3;
            this.addTextureIndex();

            this.textura3 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE3);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura3);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img4.crossOrigin = "anonymous";
            this.img4.src = locFichero4;
            this.addTextureIndex();

            this.textura4 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE4);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura4);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img5.crossOrigin = "anonymous";
            this.img5.src = locFichero5;
            this.addTextureIndex();

            this.textura5 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE5);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura5);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );
            this.img6.crossOrigin = "anonymous";
            this.img6.src = locFichero6;
            this.addTextureIndex();

            this.textura6 = this.gl.createTexture();
            this.gl.activeTexture(this.gl.TEXTURE6);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura6);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                1,
                1,
                0,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0])
            );


            this.img.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );
            };
            this.img1.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura1);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img1
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
            this.img2.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura2);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img2
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
            this.img3.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura3);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img3
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
            this.img4.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura4);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img4
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
            this.img5.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura5);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img5
                );

                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
            this.img6.onload = () => {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textura6);
                this.gl.texImage2D(
                    this.gl.TEXTURE_2D,
                    0,
                    this.gl.RGBA,
                    this.gl.RGBA,
                    this.gl.UNSIGNED_BYTE,
                    this.img6
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MAG_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_MIN_FILTER,
                    this.gl.LINEAR
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_S,
                    this.gl.CLAMP_TO_EDGE
                );
                this.gl.texParameteri(
                    this.gl.TEXTURE_2D,
                    this.gl.TEXTURE_WRAP_T,
                    this.gl.CLAMP_TO_EDGE
                );

            };
        }
        return recuperado;
    }

    addTextureIndex() {
        this.contadorTexturas++;
    }

    getTextureIndex() {
        return this.contadorTexturas;
    }
}
