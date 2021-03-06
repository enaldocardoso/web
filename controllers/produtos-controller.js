const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {

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
}

exports.getUmProduto = (req, res, next) => {

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
};

exports.postProduto = (req, res, next) => {
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
};

exports.deleteProduto = (req, res, next) => {
	res.status(201).send({
		mensagem: 'DELETE rota produtos'
	})
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
};

exports.updateProduto = (req, res, next) => {

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
};