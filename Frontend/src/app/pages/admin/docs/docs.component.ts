import { Component, OnInit } from '@angular/core';
import * as SwaggerUI from 'swagger-ui';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    SwaggerUI({
        domNode: document.getElementById('swagger-ui-item'),
        spec : {
          "swagger": "2.0",
          "info": {
              "description": "This is a sample server API server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.",
              "version": "1.0.0",
              "title": "Swagger EventUA",
              "termsOfService": "http://swagger.io/terms/",
              "contact": {
                  "email": "apiteam@swagger.io"
              },
              "license": {
                  "name": "Apache 2.0",
                  "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
              }
          },
          "host": "localhost:3000",
          "basePath": "/api/",
          "tags": [{
                  "name": "eventos",
                  "description": ""
              },
              {
                "name": "lugares",
                "description": ""
              },
              {
                "name": "notificaciones",
                "description": ""
              },
              {
                  "name": "usuarios",
                  "description": ""
              }
          ],
          "schemes": [
              "https",
              "http"
          ],
          "paths": {
              "/eventos": {
                  "post": {
                      "tags": [
                          "eventos"
                      ],
                      "summary": "Añadir un nuevo evento",
                      "description": "",
                      "operationId": "addEvento",
                      "consumes": [
                          "application/json",
                          "application/xml"
                      ],
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "in": "body",
                          "name": "body",
                          "description": "Objeto evento que será añadido",
                          "required": true,
                      }],
                      "responses": {
                          "405": {
                              "description": "Invalid input"
                          }
                      },
                  },
                  "get": {
                    "tags": [
                        "eventos"
                    ],
                      "summary": "Listado de todos los eventos ",
                      "description": "",
                      "operationId": "getEventos",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [],
                      "responses": {
                          "default": {
                              "description": "successful operation"
                          }
                      }
                   }


              },
              "/eventos/findByNombre": {
                  "get": {
                      "tags": [
                          "eventos"
                      ],
                      "summary": "Encuentra eventos por nombre",
                      "description": "Se debe seguir el formato : api/?desde=0&texto=nombre_evento",
                      "operationId": "findEventoByNombre",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "name": "nombre",
                          "in": "query",
                          "description": "Nombre del evento",
                          "required": true,
                          "type": "string"
                      }],
                      "responses": {
                          "200": {
                              "description": "successful operation",
                              "schema": {
                                  "type": "array",
                                  "items": {
                                      "$ref": "#/definitions/Evento"
                                  }
                              }
                          },
                          "400": {
                              "description": "Invalid nombre value"
                          }
                      },
                  }
              },
              "/eventos/{eventoId}": {
                  "get": {
                      "tags": [
                          "eventos"
                      ],
                      "summary": "Encontrar un evento por su ID",
                      "description": "Devuelve un único evento",
                      "operationId": "getEventoById",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "name": "EventoId",
                          "in": "path",
                          "description": "ID del evento a devolver",
                          "required": true,
                          "type": "integer",
                          "format": "int64"
                      }],
                      "responses": {
                          "200": {
                              "description": "successful operation",
                          },
                          "400": {
                              "description": "Invalid ID supplied"
                          },
                          "404": {
                              "description": "Evento not found"
                          }
                      },
                  },"put": {
                    "tags": [
                        "eventos"
                    ],
                    "summary": "Actualizar un evento existente",
                    "description": "",
                    "operationId": "updateEvento",
                    "consumes": [
                        "application/json",
                        "application/xml"
                    ],
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "in": "body",
                        "name": "body",
                        "description": "Objeto Evento que será actualizado",
                        "required": true,
                    }],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Evento not found"
                        },
                        "405": {
                            "description": "Validation exception"
                        }
                    },
                },
                  "delete": {
                    "tags": [
                        "eventos"
                    ],
                    "summary": "Borra un evento",
                    "description": "",
                    "operationId": "deleteEvento",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                            "name": "api_key",
                            "in": "header",
                            "required": false,
                            "type": "string"
                        },
                        {
                            "name": "eventoId",
                            "in": "path",
                            "description": "Id del evento a borrar",
                            "required": true,
                            "type": "string"
                        }
                    ],
                    "responses": {
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Evento not found"
                        }
                    },
                },
              },
              "/lugares": {
                "post": {
                    "tags": [
                        "lugares"
                    ],
                    "summary": "Añadir un nuevo lugar",
                    "description": "",
                    "operationId": "addLugar",
                    "consumes": [
                        "application/json",
                        "application/xml"
                    ],
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "in": "body",
                        "name": "body",
                        "description": "Objeto lugar que será añadido",
                        "required": true,
                    }],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                },
                "get": {
                  "tags": [
                      "lugares"
                  ],
                    "summary": "Listado de todos los lugares ",
                    "description": "",
                    "operationId": "getLugares",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                 }


            },
            "/lugares/findByNombre": {
                "get": {
                    "tags": [
                        "lugares"
                    ],
                    "summary": "Encuentra lugares por nombre",
                    "description": "Se debe seguir el formato : api/?desde=0&texto=nombre_lugar",
                    "operationId": "findLugarByNombre",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "name": "nombre",
                        "in": "query",
                        "description": "Nombre del evento",
                        "required": true,
                        "type": "string"
                    }],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/definitions/Lugar"
                                }
                            }
                        },
                        "400": {
                            "description": "Invalid nombre value"
                        }
                    },
                }
            },
            "/lugares/{lugarId}": {
                "get": {
                    "tags": [
                        "lugares"
                    ],
                    "summary": "Encontrar un lugar por su ID",
                    "description": "Devuelve un único lugar",
                    "operationId": "getLugarById",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "name": "lugarId",
                        "in": "path",
                        "description": "ID del lugar a devolver",
                        "required": true,
                        "type": "string"
                    }],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Lugar not found"
                        }
                    },
                },"put": {
                  "tags": [
                      "lugares"
                  ],
                  "summary": "Actualizar un lugar existente",
                  "description": "",
                  "operationId": "updateLugar",
                  "consumes": [
                      "application/json",
                      "application/xml"
                  ],
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [{
                      "in": "body",
                      "name": "body",
                      "description": "Objeto Lugar que será actualizado",
                      "required": true,
                  }],
                  "responses": {
                      "400": {
                          "description": "Invalid ID supplied"
                      },
                      "404": {
                          "description": "Lugar not found"
                      },
                      "405": {
                          "description": "Validation exception"
                      }
                  },
              },
                "delete": {
                  "tags": [
                      "lugares"
                  ],
                  "summary": "Borra un lugar",
                  "description": "",
                  "operationId": "deleteLugar",
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [{
                          "name": "api_key",
                          "in": "header",
                          "required": false,
                          "type": "string"
                      },
                      {
                          "name": "lugarId",
                          "in": "path",
                          "description": "Id del lugar a borrar",
                          "required": true,
                          "type": "string"
                      }
                  ],
                  "responses": {
                      "400": {
                          "description": "Invalid ID supplied"
                      },
                      "404": {
                          "description": "Lugar not found"
                      }
                  },
              }
            },
              "/usuarios": {
                 "post": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Crear usuario",
                      "description": "Creación de un usuario en el sistema",
                      "operationId": "createUsuario",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "in": "body",
                          "name": "body",
                          "description": "Objeto usuario creado",
                          "required": true
                      }],
                      "responses": {
                          "default": {
                              "description": "successful operation"
                          }
                      }
                },
                "get": {
                  "tags": [
                      "usuarios"
                  ],
                  "summary": "Listado de todos los usuarios ",
                  "description": "",
                  "operationId": "getUsuarios",
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [],
                  "responses": {
                      "default": {
                          "description": "successful operation"
                      }
                  }
                }
              },
              "/login": {
                  "get": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Logea al usuario en el sistema",
                      "description": "",
                      "operationId": "loginUsuario",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                              "name": "email",
                              "in": "query",
                              "description": "Email del usuario",
                              "required": true,
                              "type": "string"
                          },
                          {
                              "name": "password",
                              "in": "query",
                              "description": "Contraseña del usuario",
                              "required": true,
                              "type": "string"
                          }
                      ],
                      "responses": {
                          "200": {
                              "description": "successful operation",
                              "schema": {
                                  "type": "string"
                              },
                              "headers": {
                                  "X-Rate-Limit": {
                                      "type": "integer",
                                      "format": "int32",
                                      "description": "calls per hour allowed by the user"
                                  },
                                  "X-Expires-After": {
                                      "type": "string",
                                      "format": "date-time",
                                      "description": "date in UTC when token expires"
                                  }
                              }
                          },
                          "400": {
                              "description": "Invalid email/password supplied"
                          }
                      }
                  }
              },
              "/logout": {
                  "get": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Cierra la sesión actual",
                      "description": "",
                      "operationId": "logoutUsuario",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [],
                      "responses": {
                          "default": {
                              "description": "successful operation"
                          }
                      }
                  }
              },
              "/usuarios/{textoBusqueda}": {
                  "get": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Obtener usuarios por nombre, apellido o email",
                      "description": "",
                      "operationId": "getUsuarioByName",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "name": "textoBusqueda",
                          "in": "path",
                          "description": "",
                          "required": true,
                          "type": "string"
                      }],
                      "responses": {
                          "200": {
                              "description": "successful operation",
                              "schema": {
                                  "$ref": "#/definitions/User"
                              }
                          },
                          "400": {
                              "description": "Invalid username supplied"
                          },
                          "404": {
                              "description": "User not found"
                          }
                      }
                  },
          },
          "usuarios/{usuarioId}":{
            "get": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Obtener usuarios por id",
                      "description": "",
                      "operationId": "getUsuarioById",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "name": "uid",
                          "in": "path",
                          "description": "",
                          "required": true,
                          "type": "string"
                      }],
                      "responses": {
                          "200": {
                              "description": "successful operation",
                              "schema": {
                                  "$ref": "#/definitions/User"
                              }
                          },
                          "400": {
                              "description": "Invalid uid supplied"
                          },
                          "404": {
                              "description": "Usuario no encontrado"
                          }
                      }
                  },
                  "put": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Actualizar usuario",
                      "description": "Esta acción solo se puede realizar logeado",
                      "operationId": "updateUsuario",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                              "name": "uid",
                              "in": "path",
                              "description": "name that need to be updated",
                              "required": true,
                              "type": "string"
                          },
                          {
                              "in": "body",
                              "name": "body",
                              "description": "Usuario actualizado",
                              "required": true
                          }
                      ],
                      "responses": {
                          "400": {
                              "description": "Invalid user supplied"
                          },
                          "404": {
                              "description": "User not found"
                          }
                      }
                  },
                  "delete": {
                      "tags": [
                          "usuarios"
                      ],
                      "summary": "Borrar usuario",
                      "description": "Esta acción solo se puede realizar logeado",
                      "operationId": "deleteUser",
                      "produces": [
                          "application/xml",
                          "application/json"
                      ],
                      "parameters": [{
                          "name": "uid",
                          "in": "path",
                          "description": "Usuario a borrar",
                          "required": true,
                          "type": "string"
                      }],
                      "responses": {
                          "400": {
                              "description": "Invalid username supplied"
                          },
                          "404": {
                              "description": "User not found"
                          }
                      }
                  }
              },
              "/notificaciones": {
                "post": {
                    "tags": [
                        "notificaciones"
                    ],
                    "summary": "Añadir una nueva notificación",
                    "description": "",
                    "operationId": "addNotificación",
                    "consumes": [
                        "application/json",
                        "application/xml"
                    ],
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "in": "body",
                        "name": "body",
                        "description": "Objeto notificación que será añadida",
                        "required": true,
                    }],
                    "responses": {
                        "405": {
                            "description": "Invalid input"
                        }
                    },
                },
                "get": {
                  "tags": [
                      "notificaciones"
                  ],
                    "summary": "Listado de todas las notificaciones ",
                    "description": "",
                    "operationId": "getNotificaciones",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [],
                    "responses": {
                        "default": {
                            "description": "successful operation"
                        }
                    }
                 }
            },
            "/notificaciones/{notificaciónId}": {
                "get": {
                    "tags": [
                        "notificaciones"
                    ],
                    "summary": "Encontrar una notificación por su ID",
                    "description": "Devuelve una única notificación",
                    "operationId": "getNotificacionById",
                    "produces": [
                        "application/xml",
                        "application/json"
                    ],
                    "parameters": [{
                        "name": "NotificacionId",
                        "in": "path",
                        "description": "ID de la notificación a devolver",
                        "required": true,
                        "type": "string"
                    }],
                    "responses": {
                        "200": {
                            "description": "successful operation",
                        },
                        "400": {
                            "description": "Invalid ID supplied"
                        },
                        "404": {
                            "description": "Notificación not found"
                        }
                    },
                },"put": {
                  "tags": [
                      "notificaciones"
                  ],
                  "summary": "Actualizar una notificación existente",
                  "description": "",
                  "operationId": "updateNotificacion",
                  "consumes": [
                      "application/json",
                      "application/xml"
                  ],
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [{
                      "in": "body",
                      "name": "body",
                      "description": "Objeto Notificación que será actualizado",
                      "required": true,
                  }],
                  "responses": {
                      "400": {
                          "description": "Invalid ID supplied"
                      },
                      "404": {
                          "description": "Notificación not found"
                      },
                      "405": {
                          "description": "Validation exception"
                      }
                  },
              },
                "delete": {
                  "tags": [
                      "notificaciones"
                  ],
                  "summary": "Borra una notificación",
                  "description": "",
                  "operationId": "deleteNotificacion",
                  "produces": [
                      "application/xml",
                      "application/json"
                  ],
                  "parameters": [{
                          "name": "api_key",
                          "in": "header",
                          "required": false,
                          "type": "string"
                      },
                      {
                          "name": "notificacionId",
                          "in": "path",
                          "description": "Id de la notificación a borrar",
                          "required": true,
                          "type": "string"
                      }
                  ],
                  "responses": {
                      "400": {
                          "description": "Invalid ID supplied"
                      },
                      "404": {
                          "description": "Notificación not found"
                      }
                  },
              }
            },
          },
          "securityDefinitions": {

          },
          "definitions": {
              "Evento": {
                  "type": "object",
                  "properties": {
                      "_id": {
                          "type": "string"
                      },
                      "nombre": {
                        "type": "string"
                      },
                      "lugar": {
                        "type": "Lugar"
                      },
                      "estado": {
                        "type": "string",
                        "default": "PENDIENTE"
                      },
                      "asistentes": [{ //eventos que se celebran en el lugar
                          "usuario": {
                              "type": "Usuario"
                          }
                      }],
                      "max_aforo": {
                        "type": "Number"
                      },
                      "descripcion": {
                        "type": "String"
                      },
                      "tipo": {
                        "type": "String"
                      },
                      "precio": {
                        "type": "Number"
                      },
                      "area": {
                        "type": "String"
                      },
                      "fecha": {
                        "type": "Date"
                      },
                      "hora": {
                        "type": "String"
                      },
                      "valoracion": {
                        "type": "Number",
                        "default": "0"
                      },
                      "usuario": {
                          "type": "Usuario"
                      }
                  },
                  "xml": {
                      "name": "Evento"
                  }
              },
              "Lugar": {
                  "type": "object",
                  "properties": {
                      "_id": {
                          "type": "integer",
                          "format": "int64"
                      },
                      "nombre": {
                        "type": "String"
                      },
                      "nombre_corto": {
                        "type": "String"
                      },
                      "eventos": [{ //eventos que se celebran en el lugar
                        "evento": {
                          "type": "Evento"
                          },
                      }],
                      "descripcion": {
                        "type": "String"
                      },
                      "geolocalizacion": { // coordenadas en latitud y longitud del lugar
                        "latitud": {
                          "type": "Number",
                          "default": "0"
                          },
                          "longitud": {
                            "type": "Number",
                            "default": "0"
                          }
                      },
                      "id": {
                        "type": "String",
                        "unique": "true"
                      }
                  },
                  "xml": {
                      "name": "Lugar"
                  }
              },
              "Usuario": {
                  "type": "object",
                  "properties": {
                      "_id": {
                          "type": "integer",
                          "format": "int64"
                      },
                      "email": {
                        "type": "String",
                        "unique": "true"
                    },
                    "nombre": {
                      "type": "String"
                    },
                    "apellido": {
                      "type": "String"
                    },
                    "edad": {
                      "type": "Number"
                    },
                    "password": {
                      "type": "String"
                    },
                    "imagen": {
                      "type": "String"
                    },
                    "activo": {
                      "type": "Boolean",
                      "default": "true"
                    },
                    "baneado": {
                      "type": "Boolean",
                      "default": "false"
                    },
                    "rol": {
                      "type": "String",
                      "default": "USUARIO"
                    },
                    "notificaciones": [{
                      "notificacion": {
                        "type": "Notificacion"
                        }
                    }],
                  },
                  "xml": {
                      "name": "Usuario"
                  }
              },
              "Notificación": {
                  "type": "object",
                  "properties": {
                      "_id": {
                          "type": "String"
                      },
                      "receptores": [{ //receptores de la notificación
                        "usuario": {
                          "type": "Usuario"
                        },
                    }],
                    "texto": {
                      "type": "String",
                    }
                  },
                  "xml": {
                      "name": "Notificación"
                  }
              },
              "ApiResponse": {
                  "type": "object",
                  "properties": {
                      "code": {
                          "type": "integer",
                          "format": "int32"
                      },
                      "type": {
                          "type": "string"
                      },
                      "message": {
                          "type": "string"
                      }
                  }
              }
          },
          "externalDocs": {
              "description": "Find out more about Swagger",
              "url": "http://swagger.io"
          }
      }
      });
}
}
