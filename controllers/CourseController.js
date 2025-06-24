const { Course, Enrollment, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Operações de gerenciamento de cursos e inscrições
 */

module.exports = {
  /**
   * @swagger
   * /cursos:
   *   get:
   *     summary: Lista todos os cursos disponíveis
   *     tags: [Cursos]
   *     parameters:
   *       - in: query
   *         name: filtro
   *         schema:
   *           type: string
   *         description: Filtro por nome do curso
   *     responses:
   *       200:
   *         description: Lista de cursos disponíveis
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   nome:
   *                     type: string
   *                     example: Curso de JavaScript
   *                   descricao:
   *                     type: string
   *                     example: Aprenda JavaScript do zero
   *                   capa:
   *                     type: string
   *                     example: https://exemplo.com/capa.jpg
   *                   inscricoes:
   *                     type: integer
   *                     example: 25
   *                   inicio:
   *                     type: string
   *                     format: date
   *                     example: "2025-07-15"
   *                   inscrito:
   *                     type: boolean
   *                     example: false
   *       500:
   *         description: Erro interno do servidor
   */
  listarCursos: async (req, res) => {
    try {
      const { filtro } = req.query;
      const hoje = new Date().toISOString().split('T')[0];
      
      // Condições de busca
      const where = {
        inicio: { [Op.gte]: hoje }
      };
      
      if (filtro) {
        where.nome = { [Op.iLike]: `%${filtro}%` };
      }
      
      // Buscar cursos
      const cursos = await Course.findAll({
        where,
        attributes: [
          'id',
          'nome',
          'descricao',
          'capa',
          'inicio',
          [sequelize.literal(
            `(SELECT COUNT(*) FROM "Enrollments" 
             WHERE "Enrollments"."course_id" = "Course"."id"
             AND "Enrollments"."canceled_at" IS NULL)`
          ), 'inscricoes']
        ],
        order: [['inicio', 'ASC']]
      });
      
      // Formatar resposta
      const cursosFormatados = cursos.map(curso => {
        return {
          id: curso.id,
          nome: curso.nome,
          descricao: curso.descricao,
          capa: curso.capa,
          inscricoes: parseInt(curso.get('inscricoes')),
          inicio: curso.inicio,
          inscrito: false // Será preenchido pelo front-end para usuários logados
        };
      });
      
      return res.status(200).json(cursosFormatados);
    } catch (error) {
      console.error("Erro ao listar cursos:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  },

  /**
   * @swagger
   * /cursos/{idCurso}:
   *   post:
   *     summary: Inscreve o usuário em um curso
   *     tags: [Cursos]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: idCurso
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do curso
   *     responses:
   *       200:
   *         description: Inscrição realizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                   example: Inscrição realizada com sucesso
   *       400:
   *         description: Erro na requisição
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *       403:
   *         description: Acesso não autorizado
   *       404:
   *         description: Curso não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  inscreverCurso: async (req, res) => {
    try {
      const { idCurso } = req.params;
      const userId = req.user.id;
      
      // Verificar se o curso existe
      const curso = await Course.findByPk(idCurso);
      if (!curso) {
        return res.status(404).json({ mensagem: "Curso não encontrado" });
      }
      
      // Verificar se o curso já começou
      const hoje = new Date();
      if (new Date(curso.inicio) < hoje) {
        return res.status(400).json({ mensagem: "Este curso já começou" });
      }
      
      // Verificar se o usuário já está inscrito
      const inscricaoExistente = await Enrollment.findOne({
        where: {
          user_id: userId,
          course_id: idCurso,
          canceled_at: null
        }
      });
      
      if (inscricaoExistente) {
        return res.status(400).json({ mensagem: "Você já está inscrito neste curso" });
      }
      
      // Criar nova inscrição
      await Enrollment.create({
        user_id: userId,
        course_id: idCurso,
        enrolled_at: new Date()
      });
      
      return res.status(200).json({ mensagem: "Inscrição realizada com sucesso" });
    } catch (error) {
      console.error("Erro ao inscrever no curso:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  },

  /**
   * @swagger
   * /cursos/{idCurso}:
   *   delete:
   *     summary: Cancela a inscrição em um curso
   *     tags: [Cursos]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: idCurso
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do curso
   *     responses:
   *       200:
   *         description: Inscrição cancelada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                   example: Inscrição cancelada com sucesso
   *       400:
   *         description: Erro na requisição
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *       403:
   *         description: Acesso não autorizado
   *       404:
   *         description: Inscrição não encontrada
   *       500:
   *         description: Erro interno do servidor
   */
  cancelarInscricao: async (req, res) => {
    try {
      const { idCurso } = req.params;
      const userId = req.user.id;
      
      // Buscar inscrição ativa
      const inscricao = await Enrollment.findOne({
        where: {
          user_id: userId,
          course_id: idCurso,
          canceled_at: null
        }
      });
      
      if (!inscricao) {
        return res.status(404).json({ mensagem: "Inscrição não encontrada" });
      }
      
      // Verificar se o curso já começou
      const curso = await Course.findByPk(idCurso);
      if (curso && new Date(curso.inicio) < new Date()) {
        return res.status(400).json({ mensagem: "Não é possível cancelar inscrição após o início do curso" });
      }
      
      // Atualizar registro com data de cancelamento
      inscricao.canceled_at = new Date();
      await inscricao.save();
      
      return res.status(200).json({ mensagem: "Inscrição cancelada com sucesso" });
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  },

  /**
   * @swagger
   * /{idUsuario}:
   *   get:
   *     summary: Lista os cursos inscritos de um usuário
   *     tags: [Cursos]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: idUsuario
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Lista de cursos inscritos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   nome:
   *                     type: string
   *                     example: Curso de JavaScript
   *                   descricao:
   *                     type: string
   *                     example: Aprenda JavaScript do zero
   *                   capa:
   *                     type: string
   *                     example: https://exemplo.com/capa.jpg
   *                   inscricoes:
   *                     type: integer
   *                     example: 25
   *                   inicio:
   *                     type: string
   *                     format: date
   *                     example: "2025-07-15"
   *                   inscricao_cancelada:
   *                     type: boolean
   *                     example: false
   *                   inscrito:
   *                     type: boolean
   *                     example: true
   *       403:
   *         description: Acesso não autorizado
   *       500:
   *         description: Erro interno do servidor
   */
  listarCursosInscritos: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const userId = req.user.id;
      
      // Verificar se o usuário logado é o mesmo da rota
      if (parseInt(idUsuario) !== userId) {
        return res.status(403).json({ mensagem: "Acesso não autorizado" });
      }
      
      // Buscar todas as inscrições do usuário
      const inscricoes = await Enrollment.findAll({
        where: { user_id: userId },
        include: [{
          model: Course,
          attributes: ['id', 'nome', 'descricao', 'capa', 'inicio']
        }]
      });
      
      // Contar inscrições ativas por curso
      const contagemInscricoes = await Enrollment.findAll({
        attributes: [
          'course_id',
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_inscritos']
        ],
        where: { canceled_at: null },
        group: ['course_id']
      });
      
      const contagemMap = contagemInscricoes.reduce((map, item) => {
        map[item.course_id] = item.get('total_inscritos');
        return map;
      }, {});
      
      // Formatar resposta
      const cursosFormatados = inscricoes.map(inscricao => {
        const curso = inscricao.Course;
        return {
          id: curso.id,
          nome: curso.nome,
          descricao: curso.descricao,
          capa: curso.capa,
          inscricoes: contagemMap[curso.id] || 0,
          inicio: curso.inicio,
          inscricao_cancelada: !!inscricao.canceled_at,
          inscrito: !inscricao.canceled_at
        };
      });
      
      return res.status(200).json(cursosFormatados);
    } catch (error) {
      console.error("Erro ao listar cursos inscritos:", error);
      return res.status(500).json({ 
        mensagem: "Erro interno do servidor",
        erro: error.message
      });
    }
  },

  /**
   * @swagger
   * /cursos:
   *   post:
   *     summary: Cria um novo curso
   *     tags: [Cursos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               descricao:
   *                 type: string
   *               capa:
   *                 type: string
   *               inicio:
   *                 type: string
   *                 format: date
   *     responses:
   *       201:
   *         description: Curso criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro interno do servidor
   */
  criarCurso: async (req, res) => {
    try {
      const { nome, descricao, capa, inicio } = req.body;
      if (!nome || !inicio) {
        return res.status(400).json({ mensagem: 'Nome e data de início são obrigatórios' });
      }
      const novoCurso = await Course.create({ nome, descricao, capa, inicio });
      return res.status(201).json(novoCurso);
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor', erro: error.message });
    }
  },
};