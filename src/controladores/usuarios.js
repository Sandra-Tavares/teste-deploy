const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, telefone } = req.body;

    try {
        const usuarioEncontrato = await knex('usuarios')
            .where({ email }).first();

        if (usuarioEncontrato) {
            return res.status(400).json({ mensagem: "O email já existe" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios')
            .insert({
                nome,
                email,
                senha: senhaCriptografada,
                telefone
            }).returning('*');

        const { senha: _, ...usuarioCadastrado } = usuario[0]

        return res.status(201).json(usuarioCadastrado);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
};

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, telefone } = req.body;
    const { id } = req.usuario;

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        if (email !== req.usuario.email) {
            const emailUsuarioExiste = await knex('usuarios').where({ email }).first();

            if (emailUsuarioExiste) {
                return res.status(400).json({ mensagem: 'O Email já existe' });
            }
        }

        await knex('usuarios')
            .where({ id }).update({
                nome,
                email,
                senha: senhaCriptografada,
                telefone
            });

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}