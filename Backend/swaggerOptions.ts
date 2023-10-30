export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Task API',
            version: '1.0.0',
            description: "API Rest de EventUA dinámica"
        },
        servers: [{
            url: "http://localhost:4200"
        }]
    },
    apis: ["./routes/*.js"]
}