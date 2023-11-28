const express = require('express')
const filtrologin = require('./intermediarios/filtro_login');
const { cadastrarUsuario, obterPerfil, atualizarPerfil } = require('./controladores/usuarios');
const validarRrequisicao = require('./intermediarios/validarRequisicao');
const usuarioSchema = require('./validacao/usuarioSchema');
const loginSchema = require('./validacao/loginSchema');
const login = require('./controladores/autenticacao');
const rotas = express()

rotas.post('/usuarios', validarRrequisicao(usuarioSchema), cadastrarUsuario);

rotas.post('/login', validarRrequisicao(loginSchema), login);

rotas.use(filtrologin)

rotas.get('/perfil', obterPerfil);

rotas.put('/perfil', validarRrequisicao(usuarioSchema), atualizarPerfil);

module.exports = rotas
