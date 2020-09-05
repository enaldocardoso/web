const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');

//pegar o nome do arquivo
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		//cb(null, new Date().toISOString() + file.originalname);
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);	
	}else {
		cb(null, false);
	}
}

const upload = multer({
	 storage: storage,
	 limits: {
		 fileSize: 1024 * 1024 * 5
	 },
	  fileFilter: fileFilter
	});

router.get('/', (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }

		conn.query(
			'SELECT * FROM produtos;',
			(error, result, field) => {
				if (error) { return res.status(500).send({ error: error, response: null })}
				const response = {
					quantidade: result.length,
					produtos: result.map(prod => {
						return {
							id_produto: prod.id_produto,
							nome: prod.nome,
							preco: prod.preco,
							imagem_produto: prod.imagem_produto,
							request: {
								tipo: 'GET',
								descricao: 'Retorna todos os produtos',
								url: 'http://localhost:3000/produtos/' + prod.id_produto
							}
						}
					})
				}
				return res.status(200).send(response);
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
			(error, result, field) => {
				if (error) { return res.status(500).send({ error: error, response: null })}

				if (result.length == 0) {
					return res.status(404).send({
						mensagem: 'Produto não encontrado'
					})
				}

				const response = {

					produto: {
							id_produto: result[0].id_produto,
							nome: result[0].nome,
							preco: result[0].preco,
							imagem_produto: result[0].imagem_produto,
							request: {
								tipo: 'GET',
								descricao: 'Retorna um produto',
								url: 'http://localhost:3000/produtos'
							}
						}
				}

				return res.status(200).send(response);
			}
		)
	});

});

router.post('/', upload.single('produto_imagem'), (req, res, next) => {
	console.log(req.file);
	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
			[
				req.body.nome,
				req.body.preco,
				req.file.path
			],
			(error, result, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error, response: null })}

				const response = {
					mensagem: 'Produto inserido com sucesso',
					produtoCriado: {
							id_produto: result.id_produto,
							nome: req.body.nome,
							preco: req.body.preco,
							imagem_produto: req.file.path,
							request: {
								tipo: 'POST',
								descricao: 'Insere um produto',
								url: 'http://localhost:3000/produtos'
							}
						}
				}

				return res.status(201).send(response);
			}
		)
	});

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
			(error, result, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error, response: null })}

				const response = {
					mensagem: 'Produto inserido com sucesso',
					produtoAtualizado: {
							id_produto: req.body.id_produto,
							nome: req.body.nome,
							preco: req.body.preco,
							request: {
								tipo: 'GET',
								descricao: 'Retorna os detalhes de um produto especifico',
								url: 'http://localhost:3000/produtos/' + req.body.id_produto
							}
						}
				}

				res.status(202).send({
					mensagem: 'Produto alterado com sucesso.',
				});
			}
		)
	});
});

// router.delete('/', (req, res, next) => {
// 	res.status(201).send({
// 		mensagem: 'DELETE rota produtos'
// 	})
// 	mysql.getConnection((error, conn ) => {
// 		if (error) { return res.status(500).send({ error: error }) }
// 		conn.query(
// 			`DELETE FROM produtos where id_produto = ?`,
// 			[req.body.id_produto],
// 			(error, resultado, field) => {
// 				conn.release();

// 				if (error) { return res.status(500).send({ error: error, response: null })}

// 				res.status(202).send({
// 					mensagem: 'Produto excluído com sucesso.',
// 				});
// 			}
// 		)
// 	});
// });

//v1
// router.delete('/', (req, res, next) => {
// 	mysql.getConnection((error, conn ) => {
// 		if (error) { return res.status(500).send({ error: error }) }
// 		conn.query(
// 			`DELETE FROM produtos where id_produto = ?`,
// 			[req.body.id_produto],
// 			(error, result, field) => {
// 				conn.release();

// 				if (error) { return res.status(500).send({ error: error }) }

// 				const response = {
// 					mensagem: 'Produto excluído com sucesso',
// 					// request: {
// 					// 	tipo: 'POST',
// 					// 	descricao: 'Insere um produto',
// 					// 	url: 'http://localhost:3000/produtos',
// 					// 	body: {
// 					// 		nome: 'String',
// 					// 		preco: 'Number'
// 					// 	}
// 					// }
// 				}
// 				return res.status(202).send(reponse);
// 			}
// 		)
// 	});
// });

module.exports = router;