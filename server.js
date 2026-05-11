import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from './generated/prisma/index.js'; 
const prisma = new PrismaClient();
import express from 'express'

const app = express()

app.use(express.json())

//LOGIN: Autenticação exigida pela prova
app.post('/login', (req, res) => {
    if (req.body.email === "usuario@esoft.com" && req.body.password === "Abc123") {
        res.status(200).json({ token: uuidv4() });
    } else {
        res.status(401).json({ error: "Credenciais invalidas" });
    }
})

// POST: Cadastra uma nova review de jogo.
app.post('/jogos', async (req, res) => { 
    try {
        const ultimoJogo = await prisma.game.findFirst({
            orderBy: { id: 'desc' }
        });

        const proximoId = ultimoJogo ? ultimoJogo.id + 1 : 1;

        const novoJogo = await prisma.game.create({ 
            data: {
                  id: proximoId,
                  nome: req.body.nome,
                  tipo: req.body.tipo,
                  nota: Number(req.body.nota),
                  review: req.body.review
            } 
        })

        res.status(201).json(novoJogo)

    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar o jogo" })
    }
})

// GET: Retorna a lista completa de jogos e reviews cadastrados
app.get('/jogos', async (req, res) => {
    try {
        const jogos = await prisma.game.findMany()
        res.status(200).json(jogos)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os jogos" })
    }
})

// GET UNICO: Busca os detalhes de um jogo específico pelo seu identificador único. 
app.get('/jogos/:id', async (req, res) => {
    try {
        const idConvertido = Number(req.params.id);
        const jogo = await prisma.game.findUnique({
            where: {
                id: idConvertido
            }
        })

        res.status(200).json(jogo)
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar este jogo" })
    }
})

// PUT: Atualiza todos os dados de um jogo existente. 
app.put('/jogos/:id', async (req, res) => {
    try {
        const idConvertido = Number(req.params.id);

        const jogoAtualizado = await prisma.game.update({ 
            where: {
                id: idConvertido
            },
            data: {
                  nome: req.body.nome,
                  tipo: req.body.tipo,
                  nota: Number(req.body.nota),
                  review: req.body.review
            } 
        })
        res.status(200).json(jogoAtualizado)
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o jogo" })
    }
})

// DELETE: Remove a review do sistema.
app.delete('/jogos/:id', async (req, res) => {
    try {
        const idConvertido = Number(req.params.id);
        await prisma.game.delete({
            where: {
                id: idConvertido
            }
        })
        res.status(204).end()
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar o jogo" })
    }
})

app.listen(3000)

// username: musilvab
// password: buq5e8UiGhETVVYW