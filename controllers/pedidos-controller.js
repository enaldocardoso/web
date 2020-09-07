const mysql = require('../mysql').pool;

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn ) => {
    if (error) { return res.status(500).send({ error: error }) }

        conn.query(
            `SELECT pedidos.id_pedido,
                pedidos.quantidade,
                produtos.id_produto,
                produtos.nome,
                produtos.preco
            FROM pedidos
                INNER JOIN produtos
                ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, field) => {
                if (error) { return res.status(500).send({ error: error, response: null })}
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )
    });   
}

exports.postPedidos = (req, res, next) => {

	mysql.getConnection((error, conn) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query('SELECT * FROM produtos WHERE id_produto = ?',
		[req.body.id_produto], 
		(error, result, field) => {
			if (error) { return res.status(500).send({ error: error }) }
			if (result.length == 0) {
				return res.status(404).send({
					mensagem: 'Produto não encontrado'
				})
			}

			conn.query(
				'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
				[req.body.id_produto, req.body.quantidade],
				(error, result, field) => {
					conn.release();
	
					if (error) { return res.status(500).send({ error: error, response: null })}
	
					const response = {
						mensagem: 'Pedido inserido com sucesso',
						pedidoCriado: {
								id_pedido: result.id_pedido,
								id_produto: req.body.id_produto,
								quantidade: req.body.quantidade,
								request: {
									tipo: 'GET',
									descricao: 'Retorna todos os pedidos',
									url: 'http://localhost:3000/pedidos'
								}
							}
					}
	
					return res.status(201).send(response);
				}
			)
		})
	});

};

exports.getUmPedidos = (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }

		conn.query(
			'SELECT * FROM pedidos where id_pedido = ?;',
			[req.params.id_pedido],
			(error, result, field) => {
				if (error) { return res.status(500).send({ error: error, response: null })}

				if (result.length == 0) {
					return res.status(404).send({
						mensagem: 'Pedido não encontrado'
					})
				}

				const response = {

					pedido: {
							id_pedido: result[0].id_pedido,
							id_produto: result[0].id_produto,
							quantidade: result[0].quantidade,
							request: {
								tipo: 'GET',
								descricao: 'Retorna um pedido',
								url: 'http://localhost:3000/pedidos'
							}
						}
				}

				return res.status(200).send(response);
			}
		)
	});
}

exports.deletePedido = (req, res, next) => {

	mysql.getConnection((error, conn ) => {
		if (error) { return res.status(500).send({ error: error }) }
		conn.query(
			`DELETE FROM pedidos where id_pedido = ?`,
			[req.body.id_pedido],
			(error, result, field) => {
				conn.release();

				if (error) { return res.status(500).send({ error: error }) }

				const response = {
					mensagem: 'Pedido excluído com sucesso',
					request: {
						tipo: 'POST',
						descricao: 'Insere um pedido',
						url: 'http://localhost:3000/pedidos',
						body: {
							id_produto: 'Number',
							quantidade: 'Number'
						}
					}
				}
				return res.status(202).send(reponse);
			}
		)
	});
}