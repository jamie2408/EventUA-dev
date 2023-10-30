import Recurso from "./Recurso.js";

export default class RecursoMalla extends Recurso {
    constructor(nombre, gl) {
        super(nombre);
        this.gl = gl;
        this.vertices = [];
        this.indiceVertices = [];
        this.normales = [];
        this.coordsTextura = [];
        this.id = [];
        this.name = [];

        //aux dibujo
        this.matrizModelo = new Float32Array(16);
        this.matrizVista = new Float32Array(16);
        this.matrizProyeccion = new Float32Array(16);
        this.camara = null;
        this.luz = null;

        this.color = new Float32Array(4);
    }

    setTextura(index) {
        this.bufferTextura = this.gl.createBuffer();
        this.textura = true;
        this.indiceTexturas = index;
    }

    cargarFichero(nombre) {
        const req = new XMLHttpRequest();
        var locFichero = null;
        if (window.location.toString().includes("eventua")) {
            locFichero = "https://eventua.ovh/assets/mallas/" + nombre + ".json";
        } else if (window.location.toString().includes("localhost:4200")) {
            locFichero = "http://localhost:4200/assets/mallas/" + nombre + ".json";
        }

        //recordar hacer un ifelse para incluir la ruta estando en el .ovh
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

        // Si el recurso se ha recuperado se guardan los datos del objeto
        if (recuperado) {
            let geometria = JSON.parse(req.responseText);
            for (var i = 0; i < geometria.meshes.length; i++) {

                // Se guardan los vertices, indices de las caras y las normales
                this.vertices.push(geometria.meshes[i].vertices);
                this.name.push(geometria.meshes[i].name);
                if (geometria.meshes[i].id) {
                    this.id.push(geometria.meshes[i].id);
                }
                this.indiceVertices.push([].concat.apply([], geometria.meshes[i].faces));
                this.normales.push(geometria.meshes[i].normals);
                this.coordsTextura.push(geometria.meshes[i].texturecoords);
            }
            //console.log("vertices " + this.indiceVertices[0]);
        }

        return recuperado;
    }

    dibujar(malla, camara, luz, dibujarTexturas, listaeventos, rotacionpins) {
        
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
        
        this.camara = camara.getEntidad();
        this.luz= luz.getEntidad();
        
        var vertexShaderText = [
            "precision mediump float;",
            "attribute vec3 vertPosition;",
            "attribute vec2 vertTexCoord;",
            "attribute vec3 vertNormal;",
            "varying vec2 fragTexCoord;",
            "varying vec3 fragNormal;",
            "uniform vec4 vColor;",
            "uniform mat4 mWorld;",
            "uniform mat4 mView;",
            "uniform mat4 mProj;",
            "",
            "void main()",
            "{",
            "fragTexCoord = vertTexCoord;",
            "fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;",
            "gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);",
            "}",
        ].join("\n");

        var fragmentShaderText = [
            "precision mediump float;",
            "struct DirectionalLight",
            "{",
            "vec3 direction;",
            "vec3 color;",
            "};",
            "varying vec2 fragTexCoord;",
            "varying vec2 fragTexCoord1;",
            "varying vec2 fragTexCoord2;",

            "varying vec3 fragNormal;",

            "uniform vec3 ambientLightIntensity;",
            "uniform DirectionalLight sun;",
            "uniform sampler2D sampler;",

            "void main()",
            "{",
            "vec3 surfaceNormal = normalize(fragNormal);",
            "vec3 normSunDir = normalize(sun.direction);",
            "vec4 texel = texture2D(sampler, fragTexCoord);",

            "vec3 lightIntensity = ambientLightIntensity + sun.color * max(dot(fragNormal, normSunDir), 0.0);",
            "gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);",
            "}",
        ].join("\n");

        var pickFragmentShaderText = [
            "precision mediump float;",
            "uniform vec4 vColor;",
            "void main() {",
            "gl_FragColor = vColor;",
            "}",
        ].join("\n");

        //se crean los shaders
        var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        var pickFragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        //se obtienen los shaders del codigo anterior
        this.gl.shaderSource(vertexShader, vertexShaderText);
        this.gl.shaderSource(fragmentShader, fragmentShaderText);
        this.gl.shaderSource(pickFragmentShader, pickFragmentShaderText);

        //se compilan los shaders
        this.gl.compileShader(vertexShader);
        this.gl.compileShader(fragmentShader);
        this.gl.compileShader(pickFragmentShader);


        //se crean dos programas, uno de dibujado normal (texturas) y otro para el color pick
        var programa = this.gl.createProgram();
        var pickPrograma = this.gl.createProgram();
        this.gl.attachShader(programa, vertexShader);
        this.gl.attachShader(programa, fragmentShader);
        //como el color pick usa el mismo vertex shader, se adjunta
        this.gl.attachShader(pickPrograma, vertexShader);
        this.gl.attachShader(pickPrograma, pickFragmentShader);

        //si no se dibujan texturas es que vamos a usar el color pick para detectar mallas
        if (!dibujarTexturas) { //colorPick
            //se usa el programa del color pick
            this.gl.linkProgram(pickPrograma);
            this.gl.validateProgram(pickPrograma);
            this.gl.useProgram(pickPrograma);
            //se hace un for para pintar los vertices
            for (var i = 0; i < this.vertices.length; i++) {

                const found = listaeventos.find(element => element.lugar.id == this.id[i]);
                if (found || this.name[i]) {
                    //se crean los buffers de vertices, normales e indice de vertices
                    var bufferVertices = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferVertices);
                    this.gl.bufferData(
                        this.gl.ARRAY_BUFFER,
                        new Float32Array(this.vertices[i]),
                        this.gl.STATIC_DRAW
                    );

                    var bufferIndices = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
                    this.gl.bufferData(
                        this.gl.ELEMENT_ARRAY_BUFFER,
                        new Uint16Array(this.indiceVertices[i]),
                        this.gl.STATIC_DRAW
                    );

                    var bufferNormales = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferNormales);
                    this.gl.bufferData(
                        this.gl.ARRAY_BUFFER,
                        new Float32Array(this.normales[i]),
                        this.gl.STATIC_DRAW
                    );

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferVertices);
                    var positionAttribLocation = this.gl.getAttribLocation(pickPrograma, "vertPosition");
                    this.gl.vertexAttribPointer(
                        positionAttribLocation, //attribute location
                        3, //numero de elementos por atributo (3 coordenadas que definen un vertice)
                        this.gl.FLOAT, //tipo del elemento
                        this.gl.FALSE, //no se normalizan los datos (el tipo es un float)
                        3 * Float32Array.BYTES_PER_ELEMENT, //tamaño vertice individual
                        0 //indica desde que posicion del vector se empiezan a contar los vertices
                    );
                    this.gl.enableVertexAttribArray(positionAttribLocation);

                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferNormales);
                    var normalAttribLocation = this.gl.getAttribLocation(pickPrograma, "vertNormal");
                    this.gl.vertexAttribPointer(
                        normalAttribLocation,
                        3,
                        this.gl.FLOAT,
                        this.gl.TRUE,
                        3 * Float32Array.BYTES_PER_ELEMENT,
                        0
                    );
                    this.gl.enableVertexAttribArray(normalAttribLocation);

                    //como no va a haber texturas, se crea un color distinto por cada ID
                    var colors = this.crearColor(this.id[i]);
                    var colorBuffer = this.gl.createBuffer();
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
                    this.gl.bufferData(this.gl.ARRAY_BUFFER,
                        new Float32Array(colors),
                        this.gl.STATIC_DRAW);

                    var colorAttribLocation = this.gl.getUniformLocation(pickPrograma, "vColor");
                    this.gl.uniform4fv(colorAttribLocation, colors);

                    //matrices de dibujado
                    var matWorldUniformLocation = this.gl.getUniformLocation(
                        pickPrograma,
                        "mWorld"
                    );

                    var matViewUniformLocation = this.gl.getUniformLocation(pickPrograma, "mView");
                    var matProjUniformLocation = this.gl.getUniformLocation(pickPrograma, "mProj");

                    this.matrizVista = this.camara.calcularMatrizVista();
                    this.matrizProyeccion = this.camara.calcularMatrizProyeccion();

                                            //localizacion            transposicion valor matriz
                    this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, malla);
                    this.gl.uniformMatrix4fv(
                        matViewUniformLocation,
                        this.gl.FALSE,
                        this.matrizVista
                    );
                    this.gl.uniformMatrix4fv(
                        matProjUniformLocation,
                        this.gl.FALSE,
                        this.matrizProyeccion
                    );
                    //se hace un dibujado con esos colores
                    this.gl.drawElements(
                        this.gl.TRIANGLES,
                        this.indiceVertices[i].length,
                        this.gl.UNSIGNED_SHORT,
                        0
                    );

                }
            }
            if (window.coordenadas != undefined) { //si hemos captado las coordenadas del raton (ha habido un click) se lee el color del pixel
                window.pixel = new window.Uint8Array(4);
                this.gl.readPixels(window.coordenadas[0], window.coordenadas[1], 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, window.pixel);
            }
            window.coordenadas == undefined; //se actualizan las coordenadas a undefined para que ya no se lean mas pixeles

        }
        //si no se va a usar el colorPick o bien se ha terminado de usar, se procede a hacer el dibujado con texturas

        //se usa el programa con texturas
        this.gl.linkProgram(programa);
        this.gl.validateProgram(programa);
        this.gl.useProgram(programa);

        //ILUMINACION
        var ambientUniformLocation = this.gl.getUniformLocation(
            programa,
            'ambientLightIntensity'
        );
        var sunlightDirUniformLocation = this.gl.getUniformLocation(
            programa,
            'sun.direction'
        );
        var sunlightIntUniformLocation = this.gl.getUniformLocation(
            programa,
            'sun.color'
        );

        this.gl.uniform3f(ambientUniformLocation, this.luz.getColor()[0], this.luz.getColor()[1], this.luz.getColor()[2]);
        this.gl.uniform3f(sunlightDirUniformLocation, this.luz.getPosicion()[0], this.luz.getPosicion()[1], this.luz.getPosicion()[2]);
        this.gl.uniform3f(sunlightIntUniformLocation, this.luz.getIntensidad()[0], this.luz.getIntensidad()[1], this.luz.getIntensidad()[2]);

        //se usa un for para dibujar tantos vertices como haya
        for (var i = 0; i < this.vertices.length; i++) {

            const found = listaeventos.find(element => element.lugar.id == this.id[i]);
            if (found || this.name[i]) {


                //buffer vertices
                var uaVertexBufferObject = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uaVertexBufferObject);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    new Float32Array(this.vertices[i]),
                    this.gl.STATIC_DRAW
                );

                //buffer coordenadas de textura
                var texCoordBufferObject = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBufferObject);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    new Float32Array(this.coordsTextura[i]),
                    this.gl.STATIC_DRAW
                );

                //buffer indice de vertices
                var boxIndexBufferObject = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
                this.gl.bufferData(
                    this.gl.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array(this.indiceVertices[i]),
                    this.gl.STATIC_DRAW
                );

                //buffer normales
                var normalVertexBufferObject = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalVertexBufferObject);
                this.gl.bufferData(
                    this.gl.ARRAY_BUFFER,
                    new Float32Array(this.normales[i]),
                    this.gl.STATIC_DRAW
                );

                //se saca la posicion de los vertices del vertex shader
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, uaVertexBufferObject);
                var positionAttribLocation = this.gl.getAttribLocation(programa, "vertPosition");
                this.gl.vertexAttribPointer(
                    positionAttribLocation, //attribute location
                    3, //numero de elementos por atributo (3 coordenadas que definen un vertice)
                    this.gl.FLOAT, //tipo del elemento
                    this.gl.FALSE, //no se normalizan los datos (el tipo es un float)
                    3 * Float32Array.BYTES_PER_ELEMENT, //tamaño vertice individual
                    0 //indica desde que posicion del vector se empiezan a contar los vertices
                );
                this.gl.enableVertexAttribArray(positionAttribLocation);

                //lo mismo con coordenadas de texturas
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBufferObject);
                var texCoordAttribLocation = this.gl.getAttribLocation(programa, "vertTexCoord");
                this.gl.vertexAttribPointer(
                    texCoordAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    this.gl.FLOAT, // Type of elements
                    this.gl.FALSE,
                    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0
                );
                this.gl.enableVertexAttribArray(texCoordAttribLocation);

                //lo mismo con las normales
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalVertexBufferObject);
                var normalAttribLocation = this.gl.getAttribLocation(programa, "vertNormal");
                this.gl.vertexAttribPointer(
                    normalAttribLocation,
                    3,
                    this.gl.FLOAT,
                    this.gl.TRUE,
                    3 * Float32Array.BYTES_PER_ELEMENT,
                    0
                );
                this.gl.enableVertexAttribArray(normalAttribLocation);

                //TEXTURAS
                if (this.name[i] == 'suelo') {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        1
                    );
                }

                if (this.name[i] == 'jardin') {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        2
                    );
                }
                if (this.name[i] == 'parking') {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        3
                    );
                }
                if (this.name[i] == 'camino') {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        4
                    );
                }
                if (this.id[i] != '0000') {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        0
                    );
                }
                if (!this.name[i]) {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        5
                    );
                }

                if (this.id[i] == '00' + window.selection && this.name[i]) {
                    this.gl.uniform1i(
                        this.gl.getUniformLocation(programa, "sampler"),
                        6
                    );
                }

                //matrices de dibujado
                var matWorldUniformLocation = this.gl.getUniformLocation(
                    programa,
                    "mWorld"
                );
                var matViewUniformLocation = this.gl.getUniformLocation(programa, "mView");
                var matProjUniformLocation = this.gl.getUniformLocation(programa, "mProj");

                this.matrizVista = this.camara.calcularMatrizVista();
                this.matrizProyeccion = this.camara.calcularMatrizProyeccion();

                //localizacion          transposicion   valor matriz
                this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, malla);
                this.gl.uniformMatrix4fv(
                    matViewUniformLocation,
                    this.gl.FALSE,
                    this.matrizVista
                );
                this.gl.uniformMatrix4fv(
                    matProjUniformLocation,
                    this.gl.FALSE,
                    this.matrizProyeccion
                );

                //dibujado
                this.gl.drawElements(
                    this.gl.TRIANGLES,
                    this.indiceVertices[i].length,
                    this.gl.UNSIGNED_SHORT,
                    0
                );
            }
        }
    }

    crearColor(id) {
        this.color[0] = (id % 256.) / 255;
        this.color[1] = (Math.floor(id / 256.0) % 256.0) / 255.0;
        this.color[2] = 0.0;
        this.color[3] = 1.0;

        return this.color;
    }
}
