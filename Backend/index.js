/*
Importación de módulos
*/
const options = { //opciones de swagger
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: "API dinámica de EventUA "
        },
        servers: [{
            url: "http://localhost:4200"
        }]
    },
    apis: ["./routes/*.js"]
}

const swaggerUI = require('swagger-ui-express');
const express = require('express');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');

//const lowdb = require('lowdb');

require('dotenv').config()
const { dbConnection } = require('./database/configdb');

const fileUpload = require('express-fileupload');

// Crear una aplicación de express
const app = express();

dbConnection();

const specs = swaggerJSDoc(options);

app.use(cors());
app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    createParentPath: true,
}));
app.use('/api/sendemail', require('./routes/sendemail'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/register', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/eventos', require('./routes/eventos'));
app.use('/api/lugares', require('./routes/lugares'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/notificaciones', require('./routes/notificaciones'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));



// Abrir la aplicacíon en el puerto 3000
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});