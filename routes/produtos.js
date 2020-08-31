const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }

		conn.query(
			'SELECT * FROM produtos;',
			(error, resultado, field) => {
				if (error) { return res.status(500).send({ error: error, response: null })}
				return res.status(200).send({response: resultado});
			}
		)
	});

});

router.get('/:id_produto', (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }

		conn.query(
			'SELECT * FROM produtos where id_produto = ?;',
			[req.params.id_produto],
			(error, resultado, field) => {
				if (error) { return res.status(500).send({ error: error, response: null })}
				return res.status(200).send({response: resultado});
			}
		)
	});

});

router.post('/', (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			'INSERT INTO produtos (nome, preco) VALUES (?,?)',
			[req.body.nome, req.body.preco],
			(error, resultado, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error, response: null })}

				res.status(201).send({
					mensagem: 'Produto inserido com sucesso.',
					id_produto: resultado.insertId
				});
			}
		)
	})

});

router.patch('/', (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			`UPDATE produtos
				set nome  = ?,
					preco = ?
				where id_produto = ?`,
			[
			 req.body.nome,
			 req.body.preco,
			 req.body.id_produto
			],
			(error, resultado, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error, response: null })}

				res.status(202).send({
					mensagem: 'Produto alterado com sucesso.',
				});
			}
		)
	});
});

router.delete('/', (req, res, next) => {
	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			`DELETE FROM produtos where id_produto = ?`,
			[req.body.id_produto],
			(error, resultado, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error, response: null })}

				res.status(202).send({
					mensagem: 'Produto excluído com sucesso.',
				});
			}
		)
	});
});

module.exports = router;