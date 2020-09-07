const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

const PedidosController = require('../controllers/pedidos-controller');

router.get('/', PedidosController.getPedidos);
router.get('/:id_pedido', PedidosController.getUmPedidos);
router.post('/', PedidosController.postPedidos);
router.delete('/', PedidosController.deletePedido);

module.exports = router;

// router.patch('/', (req, res, next) => {

// 	mysql.getConnection((error, conn ) => {
// 		if (error) { return res.status(500).send({ error: error }) }
// 		conn.query(
// 			`UPDATE pedidos
// 				set id_produto  = ?,
// 					quantidade = ?
// 				where id_pedido = ?`,
// 			[
// 			 req.body.id_produto,
// 			 req.body.quantidade,
// 			 req.body.id_pedido
// 			],
// 			(error, result, field) => {
// 				conn.release();

// 				if (error) { return res.status(500).send({ error: error, response: null })}

// 				const response = {
// 					mensagem: 'Pedido inserido com sucesso',
// 					pedidoAtualizado: {
// 							id_pedido: req.body.id_pedido,
// 							id_produto: req.body.id_produto,
// 							quantidade: req.body.quantidade,
// 							request: {
// 								tipo: 'GET',
// 								descricao: 'Retorna os detalhes de um pedido especifico',
// 								url: 'http://localhost:3000/pedidos/' + req.body.id_produto
// 							}
// 						}
// 				}

// 				res.status(202).send({
// 					mensagem: 'Pedido alterado com sucesso.',
// 				});
// 			}
// 		)
// 	});
// });