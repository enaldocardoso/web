const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).send({
		mensagem: 'GET rota produtos'
	})
});

router.get('/:id_produto', (req, res, next) => {

    const id = req.params.id_produto

    if ( id === 'especial' ) {
	    res.status(200).send({
        mensagem: 'Você descobriu o id especial',
        id: id
	    });
    } else {
        res.status(200).send({
        mensagem: 'Você passou um id'
        });
    }
});

router.post('/', (req, res, next) => {

	const produto = {
		nome: req.body.nome,
		preco: req.body.preco,
	};

	res.status(201).send({
		mensagem: 'Insere um produto',
		produtoCriado: produto
	})
});

router.patch('/', (req, res, next) => {
	res.status(201).send({
		mensagem: 'PATCH rota produtos'
	})
});

router.delete('/', (req, res, next) => {
	res.status(201).send({
		mensagem: 'DELETE rota produtos'
	})
});

module.exports = router;