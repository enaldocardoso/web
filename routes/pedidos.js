const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).send({
		mensagem: 'GET rota pedidos'
	})
});

router.get('/:id_pedido', (req, res, next) => {

    const id = req.params.id_pedido

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
	res.status(201).send({
		mensagem: 'POST rota pedidos'
	})
});

router.patch('/', (req, res, next) => {
	res.status(201).send({
		mensagem: 'PATCH rota pedidos'
	})
});

router.delete('/', (req, res, next) => {
	res.status(201).send({
		mensagem: 'DELETE rota pedidos'
	})
});

module.exports = router;