const Usuario = require('../models/usuarios');
const validator = require('validator');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { infoToken } = require('../helpers/infotoken');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'eventuablackpanda@gmail.com',
        pass: 'cbfrfttesggqalvw' // naturally, replace both with your real credentials or an application-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
});

const obtenerUsuarios = async(req, res) => {

    // Para paginación
    // Recibimos el desde si existe y establecemos el número de registros a devolver por pa´gina
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const pag = req.query.pag;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        // console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    // Obtenemos el ID de usuario por si quiere buscar solo un usuario
    const id = req.query.id || '';

    //await sleep(1000);
    try {

        // Solo puede listar usuarios un admin
        const token = req.header('x-token');
        if (!((infoToken(token).rol === 'ADMIN') || (infoToken(token).uid === id))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para listar usuarios',
            });
        }

        let usuarios, total;
        // Si ha llegado ID, hacemos el get /id
        if (id) {

            [usuarios, total] = await Promise.all([
                Usuario.findById(id),
                Usuario.countDocuments()
            ]);

        }
        // Si no ha llegado ID, hacemos el get / paginado
        else {
            if (texto) {
                if (pag) {
                    [usuarios, total] = await Promise.all([
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { apellido: textoBusqueda }, { email: textoBusqueda }] }).skip(desde),
                        Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { apellido: textoBusqueda }, { email: textoBusqueda }] })
                    ]);
                } else {
                    [usuarios, total] = await Promise.all([
                        Usuario.find({ $or: [{ nombre: textoBusqueda }, { apellido: textoBusqueda }, { email: textoBusqueda }] }).skip(desde).limit(registropp),
                        Usuario.countDocuments({ $or: [{ nombre: textoBusqueda }, { apellido: textoBusqueda }, { email: textoBusqueda }] })
                    ]);
                }
            } else {
                if (pag) {
                    [usuarios, total] = await Promise.all([
                        Usuario.find({}).skip(desde),
                        Usuario.countDocuments()
                    ]);
                } else {
                    [usuarios, total] = await Promise.all([
                        Usuario.find({}).skip(desde).limit(registropp),
                        Usuario.countDocuments()
                    ]);
                }
            }

        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error obteniedo usuarios'
        });
    }
}

const crearUsuario = async(req, res) => {
    const { email, password, rol } = req.body;
    const existeEmail = await Usuario.findOne({ email: email });

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 25; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }

    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Email ya existe'
        });
    } else {

        const mailOptions = {
            from: 'eventuablackpanda@gmail.com',
            to: email,
            subject: 'Verificación cuenta de EventUA',
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

                <head>
                    <meta charset="UTF-8">
                    <meta content="width=device-width, initial-scale=1" name="viewport">
                    <meta name="x-apple-disable-message-reformatting">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta content="telephone=no" name="format-detection">
                    <title></title>
                    <!--[if (mso 16)]>
                    <style media="screen">
                                                /*
                            CONFIG STYLES
                            Please do not delete and edit CSS styles below
                            */


                            /* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */

                            #outlook a {
                                padding: 0;
                            }

                            .ExternalClass {
                                width: 100%;
                            }

                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                                line-height: 100%;
                            }

                            .es-button {
                                mso-style-priority: 100 !important;
                                text-decoration: none !important;
                            }

                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }

                            .es-desk-hidden {
                                display: none;
                                float: left;
                                overflow: hidden;
                                width: 0;
                                max-height: 0;
                                line-height: 0;
                                mso-hide: all;
                            }

                            [data-ogsb] .es-button {
                                border-width: 0 !important;
                                padding: 6px 25px 6px 25px !important;
                            }


                            /*
                            END OF IMPORTANT
                            */

                            s {
                                text-decoration: line-through;
                            }

                            html,
                            body {
                                width: 100%;
                                font-family: arial, 'helvetica neue', helvetica, sans-serif;
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }

                            table {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                            }

                            table td,
                            html,
                            body,
                            .es-wrapper {
                                padding: 0;
                                Margin: 0;
                            }

                            .es-content,
                            .es-header,
                            .es-footer {
                                table-layout: fixed !important;
                                width: 100%;
                            }

                            img {
                                display: block;
                                border: 0;
                                outline: none;
                                text-decoration: none;
                                -ms-interpolation-mode: bicubic;
                            }

                            table tr {
                                border-collapse: collapse;
                            }

                            p,
                            hr {
                                Margin: 0;
                            }

                            h1,
                            h2,
                            h3,
                            h4,
                            h5 {
                                Margin: 0;
                                line-height: 120%;
                                mso-line-height-rule: exactly;
                                font-family: arial, 'helvetica neue', helvetica, sans-serif;
                            }

                            p,
                            ul li,
                            ol li,
                            a {
                                -webkit-text-size-adjust: none;
                                -ms-text-size-adjust: none;
                                mso-line-height-rule: exactly;
                            }

                            .es-left {
                                float: left;
                            }

                            .es-right {
                                float: right;
                            }

                            .es-p5 {
                                padding: 5px;
                            }

                            .es-p5t {
                                padding-top: 5px;
                            }

                            .es-p5b {
                                padding-bottom: 5px;
                            }

                            .es-p5l {
                                padding-left: 5px;
                            }

                            .es-p5r {
                                padding-right: 5px;
                            }

                            .es-p10 {
                                padding: 10px;
                            }

                            .es-p10t {
                                padding-top: 10px;
                            }

                            .es-p10b {
                                padding-bottom: 10px;
                            }

                            .es-p10l {
                                padding-left: 10px;
                            }

                            .es-p10r {
                                padding-right: 10px;
                            }

                            .es-p15 {
                                padding: 15px;
                            }

                            .es-p15t {
                                padding-top: 15px;
                            }

                            .es-p15b {
                                padding-bottom: 15px;
                            }

                            .es-p15l {
                                padding-left: 15px;
                            }

                            .es-p15r {
                                padding-right: 15px;
                            }

                            .es-p20 {
                                padding: 20px;
                            }

                            .es-p20t {
                                padding-top: 20px;
                            }

                            .es-p20b {
                                padding-bottom: 20px;
                            }

                            .es-p20l {
                                padding-left: 20px;
                            }

                            .es-p20r {
                                padding-right: 20px;
                            }

                            .es-p25 {
                                padding: 25px;
                            }

                            .es-p25t {
                                padding-top: 25px;
                            }

                            .es-p25b {
                                padding-bottom: 25px;
                            }

                            .es-p25l {
                                padding-left: 25px;
                            }

                            .es-p25r {
                                padding-right: 25px;
                            }

                            .es-p30 {
                                padding: 30px;
                            }

                            .es-p30t {
                                padding-top: 30px;
                            }

                            .es-p30b {
                                padding-bottom: 30px;
                            }

                            .es-p30l {
                                padding-left: 30px;
                            }

                            .es-p30r {
                                padding-right: 30px;
                            }

                            .es-p35 {
                                padding: 35px;
                            }

                            .es-p35t {
                                padding-top: 35px;
                            }

                            .es-p35b {
                                padding-bottom: 35px;
                            }

                            .es-p35l {
                                padding-left: 35px;
                            }

                            .es-p35r {
                                padding-right: 35px;
                            }

                            .es-p40 {
                                padding: 40px;
                            }

                            .es-p40t {
                                padding-top: 40px;
                            }

                            .es-p40b {
                                padding-bottom: 40px;
                            }

                            .es-p40l {
                                padding-left: 40px;
                            }

                            .es-p40r {
                                padding-right: 40px;
                            }

                            .es-menu td {
                                border: 0;
                            }

                            .es-menu td a img {
                                display: inline-block !important;
                            }


                            /*
                            END CONFIG STYLES
                            */

                            a {
                                text-decoration: underline;
                            }

                            p,
                            ul li,
                            ol li {
                                font-family: arial, 'helvetica neue', helvetica, sans-serif;
                                line-height: 150%;
                            }

                            ul li,
                            ol li {
                                Margin-bottom: 15px;
                                margin-left: 0;
                            }

                            .es-menu td a {
                                text-decoration: none;
                                display: block;
                                font-family: arial, 'helvetica neue', helvetica, sans-serif;
                            }

                            .es-wrapper {
                                width: 100%;
                                height: 100%;
                                background-image: ;
                                background-repeat: repeat;
                                background-position: center top;
                            }

                            .es-wrapper-color {
                                background-color: #ffffff;
                            }

                            .es-header {
                                background-color: transparent;
                                background-image: ;
                                background-repeat: repeat;
                                background-position: center top;
                            }

                            .es-header-body {
                                background-color: transparent;
                            }

                            .es-header-body p,
                            .es-header-body ul li,
                            .es-header-body ol li {
                                color: #333333;
                                font-size: 14px;
                            }

                            .es-header-body a {
                                color: #ee6c6d;
                                font-size: 14px;
                            }

                            .es-content-body {
                                background-color: #ffffff;
                            }

                            .es-content-body p,
                            .es-content-body ul li,
                            .es-content-body ol li {
                                color: #333333;
                                font-size: 14px;
                            }

                            .es-content-body a {
                                color: #ee6c6d;
                                font-size: 14px;
                            }

                            .es-footer {
                                background-color: transparent;
                                background-image: ;
                                background-repeat: repeat;
                                background-position: center top;
                            }

                            .es-footer-body {
                                background-color: #f7f7f7;
                            }

                            .es-footer-body p,
                            .es-footer-body ul li,
                            .es-footer-body ol li {
                                color: #333333;
                                font-size: 14px;
                            }

                            .es-footer-body a {
                                color: #333333;
                                font-size: 14px;
                            }

                            .es-infoblock,
                            .es-infoblock p,
                            .es-infoblock ul li,
                            .es-infoblock ol li {
                                line-height: 120%;
                                font-size: 12px;
                                color: #cccccc;
                            }

                            .es-infoblock a {
                                font-size: 12px;
                                color: #cccccc;
                            }

                            h1 {
                                font-size: 30px;
                                font-style: normal;
                                font-weight: normal;
                                color: #333333;
                            }

                            h2 {
                                font-size: 24px;
                                font-style: normal;
                                font-weight: normal;
                                color: #333333;
                            }

                            h3 {
                                font-size: 20px;
                                font-style: normal;
                                font-weight: normal;
                                color: #333333;
                            }

                            .es-header-body h1 a,
                            .es-content-body h1 a,
                            .es-footer-body h1 a {
                                font-size: 30px;
                            }

                            .es-header-body h2 a,
                            .es-content-body h2 a,
                            .es-footer-body h2 a {
                                font-size: 24px;
                            }

                            .es-header-body h3 a,
                            .es-content-body h3 a,
                            .es-footer-body h3 a {
                                font-size: 20px;
                            }

                            a.es-button,
                            button.es-button {
                                border-style: solid;
                                border-color: #474745;
                                border-width: 6px 25px 6px 25px;
                                display: inline-block;
                                background: #474745;
                                border-radius: 20px;
                                font-size: 16px;
                                font-family: helvetica, 'helvetica neue', arial, verdana, sans-serif;
                                font-weight: normal;
                                font-style: normal;
                                line-height: 120%;
                                color: #efefef;
                                text-decoration: none;
                                width: auto;
                                text-align: center;
                            }

                            .es-button-border {
                                border-style: solid solid solid solid;
                                border-color: #474745 #474745 #474745 #474745;
                                background: #474745;
                                border-width: 0px 0px 0px 0px;
                                display: inline-block;
                                border-radius: 20px;
                                width: auto;
                            }


                            /*
                            RESPONSIVE STYLES
                            Please do not delete and edit CSS styles below.
                            
                            If you don't need responsive layout, please delete this section.
                            */

                            @media only screen and (max-width: 600px) {
                                p,
                                ul li,
                                ol li,
                                a {
                                    line-height: 150% !important;
                                }
                                h1,
                                h2,
                                h3,
                                h1 a,
                                h2 a,
                                h3 a {
                                    line-height: 120% !important;
                                }
                                h1 {
                                    font-size: 30px !important;
                                    text-align: center;
                                }
                                h2 {
                                    font-size: 26px !important;
                                    text-align: center;
                                }
                                h3 {
                                    font-size: 20px !important;
                                    text-align: center;
                                }
                                .es-header-body h1 a,
                                .es-content-body h1 a,
                                .es-footer-body h1 a {
                                    font-size: 30px !important;
                                }
                                .es-header-body h2 a,
                                .es-content-body h2 a,
                                .es-footer-body h2 a {
                                    font-size: 26px !important;
                                }
                                .es-header-body h3 a,
                                .es-content-body h3 a,
                                .es-footer-body h3 a {
                                    font-size: 20px !important;
                                }
                                .es-menu td a {
                                    font-size: 16px !important;
                                }
                                .es-header-body p,
                                .es-header-body ul li,
                                .es-header-body ol li,
                                .es-header-body a {
                                    font-size: 16px !important;
                                }
                                .es-content-body p,
                                .es-content-body ul li,
                                .es-content-body ol li,
                                .es-content-body a {
                                    font-size: 16px !important;
                                }
                                .es-footer-body p,
                                .es-footer-body ul li,
                                .es-footer-body ol li,
                                .es-footer-body a {
                                    font-size: 16px !important;
                                }
                                .es-infoblock p,
                                .es-infoblock ul li,
                                .es-infoblock ol li,
                                .es-infoblock a {
                                    font-size: 12px !important;
                                }
                                *[class="gmail-fix"] {
                                    display: none !important;
                                }
                                .es-m-txt-c,
                                .es-m-txt-c h1,
                                .es-m-txt-c h2,
                                .es-m-txt-c h3 {
                                    text-align: center !important;
                                }
                                .es-m-txt-r,
                                .es-m-txt-r h1,
                                .es-m-txt-r h2,
                                .es-m-txt-r h3 {
                                    text-align: right !important;
                                }
                                .es-m-txt-l,
                                .es-m-txt-l h1,
                                .es-m-txt-l h2,
                                .es-m-txt-l h3 {
                                    text-align: left !important;
                                }
                                .es-m-txt-r img,
                                .es-m-txt-c img,
                                .es-m-txt-l img {
                                    display: inline !important;
                                }
                                .es-button-border {
                                    display: inline-block !important;
                                }
                                a.es-button,
                                button.es-button {
                                    font-size: 20px !important;
                                    display: inline-block !important;
                                    border-width: 6px 25px 6px 25px !important;
                                }
                                .es-btn-fw {
                                    border-width: 10px 0px !important;
                                    text-align: center !important;
                                }
                                .es-adaptive table,
                                .es-btn-fw,
                                .es-btn-fw-brdr,
                                .es-left,
                                .es-right {
                                    width: 100% !important;
                                }
                                .es-content table,
                                .es-header table,
                                .es-footer table,
                                .es-content,
                                .es-footer,
                                .es-header {
                                    width: 100% !important;
                                    max-width: 600px !important;
                                }
                                .es-adapt-td {
                                    display: block !important;
                                    width: 100% !important;
                                }
                                .adapt-img {
                                    width: 100% !important;
                                    height: auto !important;
                                }
                                .es-m-p0 {
                                    padding: 0px !important;
                                }
                                .es-m-p0r {
                                    padding-right: 0px !important;
                                }
                                .es-m-p0l {
                                    padding-left: 0px !important;
                                }
                                .es-m-p0t {
                                    padding-top: 0px !important;
                                }
                                .es-m-p0b {
                                    padding-bottom: 0 !important;
                                }
                                .es-m-p20b {
                                    padding-bottom: 20px !important;
                                }
                                .es-mobile-hidden,
                                .es-hidden {
                                    display: none !important;
                                }
                                tr.es-desk-hidden,
                                td.es-desk-hidden,
                                table.es-desk-hidden {
                                    width: auto!important;
                                    overflow: visible!important;
                                    float: none!important;
                                    max-height: inherit!important;
                                    line-height: inherit!important;
                                }
                                tr.es-desk-hidden {
                                    display: table-row !important;
                                }
                                table.es-desk-hidden {
                                    display: table !important;
                                }
                                td.es-desk-menu-hidden {
                                    display: table-cell!important;
                                }
                                .es-menu td {
                                    width: 1% !important;
                                }
                                table.es-table-not-adapt,
                                .esd-block-html table {
                                    width: auto !important;
                                }
                                table.es-social {
                                    display: inline-block !important;
                                }
                                table.es-social td {
                                    display: inline-block !important;
                                }
                            }


                            /*
                            END RESPONSIVE STYLES
                            */
                    </style>
                    <![endif]-->
                    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                    <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                </head>

                <body>
                    <div class="es-wrapper-color">
                        <!--[if gte mso 9]>
                            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                <v:fill type="tile" color="#ffffff"></v:fill>
                            </v:background>
                        <![endif]-->
                        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td class="esd-email-paddings" valign="top">
                                        <table cellpadding="0" cellspacing="0" class="es-content esd-header-popover" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="es-adaptive esd-stripe" style="background-color: #f7f7f7;" esd-custom-block-id="8428" bgcolor="#f7f7f7" align="center">
                                                        <table class="es-content-body" style="background-color: transparent;" width="600" cellspacing="0" cellpadding="0" align="center">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-structure es-p10" align="left">
                                                                        <!--[if mso]><table width="580"><tr><td width="280" valign="top"><![endif]-->
                                                                        <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" width="280" align="left">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="es-infoblock esd-block-text es-m-txt-c" align="left">
                                                                                                        
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <!--[if mso]></td><td width="20"></td><td width="280" valign="top"><![endif]-->
                                                                        <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" width="280" align="left">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="right" class="es-infoblock esd-block-text es-m-txt-c">
                                                                                                        <p><a href="https://viewstripo.email/" class="view" target="_blank">Powered by Stripo</a></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <!--[if mso]></td></tr></table><![endif]-->
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="es-header" align="center" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="es-adaptive esd-stripe" esd-custom-block-id="8429" align="center">
                                                        <table class="es-header-body" align="center" width="600" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-structure es-p25t es-p10b es-p20r es-p20l" align="left">
                                                                        <table cellspacing="0" cellpadding="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="es-m-p0r esd-container-frame" align="center" width="560" valign="top">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="esd-block-image es-m-p0l es-m-txt-c" align="center" style="font-size: 0px;">
                                                                                                        <a href="https://eventua.ovh" target="_blank"><img src="https://demo.stripocdn.email/content/guids/deca91e9-69d3-47c4-9329-7311a7b399bb/images/logodef_eventua.png" alt="Logo" style="display: block;" title="Logo" width="260"></a>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="es-content" align="center" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-stripe" align="center">
                                                        <table class="es-content-body" style="border-left:1px solid transparent;border-right:1px solid transparent;border-top:1px solid transparent;border-bottom:1px solid transparent;" align="center" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-structure es-p20t es-p40b es-p40r es-p40l" esd-custom-block-id="8537" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" align="left" width="518">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text es-m-txt-c" align="center">
                                                                                                        <h2>Verificación de cuenta</h2>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text es-m-txt-c es-p15t" align="center">
                                                                                                        <p>Por favor confirma tu email pinchando en el link de abajo para poder disfrutar de acceso a EventUA</p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="esd-block-button es-p20t es-p15b es-p10r es-p10l" align="center"><span class="es-button-border" style="background: #84b2d7;"><a href="http://localhost:4200/confirmed/${code}" class="es-button" target="_blank" style="background: #84b2d7; border-color: #84b2d7;">Confirmar Email</a></span></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="esd-structure es-p20t" esd-custom-block-id="8430" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" align="center" width="600" valign="top">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" class="esd-empty-container" style="display: none;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table cellpadding="0" cellspacing="0" class="es-footer" align="center">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-stripe" esd-custom-block-id="8442" style="background-color: #f7f7f7;" bgcolor="#f7f7f7" align="center">
                                                        <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-structure es-p20t es-p20b es-p20r es-p20l" esd-general-paddings-checked="false" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" width="560" valign="top" align="center">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text es-p5b" align="center">
                                                                                                        <h3 style="line-height: 150%;">Síguenos en redes!</h3>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="esd-block-social es-p10t es-p10b" align="center" style="font-size:0">
                                                                                                        <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0">
                                                                                                            <tbody>
                                                                                                                <tr>
                                                                                                                    <td class="es-p20r" valign="top" align="center">
                                                                                                                        <a href="https://www.instagram.com/eventuabp/" target="_blank"><img title="Instagram" src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Ig" width="32" height="32"></a>
                                                                                                                    </td>
                                                                                                                    <td valign="top" align="center" class="es-p20r">
                                                                                                                        <a href="https://twitter.com/eventuabp" target="_blank"><img title="Twitter" src="https://tlr.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png" alt="Tw" width="32" height="32"></a>
                                                                                                                    </td>
                                                                                                                    <td valign="top" align="center" esd-tmp-icon-type="tiktok">
                                                                                                                        <a href="https://tiktok.com/eventuabp" target="_blank"><img title="TikTok" src="https://stripo.email/static/assets/img/social-icons/logo-black/tiktok-logo-black.png" alt="Tt" width="32" height="32"></a>
                                                                                                                    </td>
                                                                                                                </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text es-p10b" align="center">
                                                                                                        <p style="line-height: 150%;"><b>@Eventuabp</b></p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td class="esd-block-text es-p10t es-p10b" align="center">
                                                                                                        <p>© 2022</p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table class="esd-footer-popover es-content" align="center" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="esd-stripe" align="center">
                                                        <table class="es-content-body" style="background-color: transparent;" align="center" width="600" cellspacing="0" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="esd-structure es-p30t es-p30b es-p20r es-p20l" align="left">
                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="esd-container-frame" align="center" width="560" valign="top">
                                                                                        <table width="100%" cellspacing="0" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" class="esd-empty-container" style="display: none;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="position: absolute; left: -9999px; top: -9999px; margin: 0px;"></div>
                </body>

                </html>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
    const cpassword = bcrypt.hashSync(password, salt); // y aquí ciframos la contraseña

    const usuario = new Usuario(req.body);
    usuario.password = cpassword;
    usuario.confirmationCode = code;
    await usuario.save();
    //creacion email de verificación

    res.json({
        ok: true,
        msg: 'crearUsuarios',
        usuario
    });
}

const actualizarUsuario = async(req, res) => {
    const { email, password, activo, ...object } = req.body;
    const uid = req.params.id;

    try {
        // Para actualizar usuario o eres admin o eres usuario del token y el uid que nos llega es el mismo
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ADMIN' || infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene permisos para actualizar este perfil'
            });
        }

        const existeEmail = await Usuario.findOne({ email: email });
        if (existeEmail) {
            if (existeEmail._id != uid) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Email ya existe'
                });
            }
        }
        object.email = email;

        // Comprobar si existe el usuario que queremos actualizar
        const existeUsuario = await Usuario.findById(uid);

        if (!existeUsuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        // llegadoa aquí el email o es el mismo o no está en BD, es obligatorio que siempre llegue un email
        object.email = email;

        // Si el rol es de administrador, entonces si en los datos venía el campo activo lo dejamos
        if ((infoToken(token).rol === 'ADMIN') && activo) {
            object.activo = activo;
        }
        // al haber extraido password del req.body nunca se va a enviar en este put
        const usuario = await Usuario.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Usuario actualizado',
            usuario
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando usuario'
        });
    }

}
const borrarUsuario = async(req, res) => {

    const uid = req.params.id;

    try {
        // Solo puede borrar usuarios un admin
        const token = req.header('x-token');

        if (!(infoToken(token).rol === 'ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para borrar usuarios',
            });
        }

        // No me puedo borrar a mi mismo
        if ((infoToken(token).uid === uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no puede eliminarse a si mismo',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeUsuario = await Usuario.findById(uid);
        if (!existeUsuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Usuario.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: true,
            msg: 'Error borrando usuario'
        });
    }

}


const actualizarPassword = async(req, res = response) => {

    const uid = req.params.id;
    const { password, nuevopassword, nuevopassword2 } = req.body;

    try {
        const token = req.header('x-token');
        // lo puede actualizar un administrador o el propio usuario del token
        if (!((infoToken(token).rol === 'ADMIN') || (infoToken(token).uid === uid))) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar contraseña',
            });
        }

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto',
            });
        }


        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        // Si es el el usuario del token el que trata de cambiar la contraseña, se comprueba que sabe la contraseña vieja y que ha puesto 
        // dos veces la contraseña nueva
        if (infoToken(token).uid === uid) {

            if (nuevopassword !== nuevopassword2) {
                return res.status(400).json({
                    ok: false,
                    msg: 'La contraseña repetida no coincide con la nueva contraseña',
                });
            }

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                    token: ''
                });
            }
        }

        // tenemos todo OK, ciframos la nueva contraseña y la actualizamos
        const salt = bcrypt.genSaltSync();
        const cpassword = bcrypt.hashSync(nuevopassword, salt);
        usuarioBD.password = cpassword;

        // Almacenar en BD
        await usuarioBD.save();

        res.json({
            ok: true,
            msg: 'Contraseña actualizada'
        });

    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al actualizar contraseña',
        });
    }


}

module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, actualizarPassword }