import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getPedidos } from '../auth/firebaseService';

const MeusPedidos = (props) => {
    const [listaPedidos, setListaPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            const pedidos = await getPedidos();
            setListaPedidos(pedidos);
        };
        fetchPedidos();
    }, []);

    const listaPedidosLI = listaPedidos.map((pedido) => (
        <Card key={pedido.id} className="mb-4">
            <Card.Header>
                <div>
                    <h4>Pedido ID: {pedido.id}</h4>
                    <p>Valor do Pedido: R$ {pedido.valorPedido}</p>
                </div>
            </Card.Header>
            <Card.Body>
                {pedido.ofertaRelacionada.map((oferta, index) => (
                    <Row key={index} className="mb-3 align-items-center">
                        <Col xs={2}>
                            {oferta.produtoRelacionado.imagens && oferta.produtoRelacionado.imagens.length > 0 && (
                                <img src={oferta.produtoRelacionado.imagens[0]} alt={oferta.produtoRelacionado.nomeProduto} style={{ width: '100%' }} />
                            )}
                        </Col>
                        <Col xs={4}>
                            <h5>{oferta.produtoRelacionado.nomeProduto}</h5>
                            <p>{oferta.descricao}</p>
                        </Col>
                        <Col xs={2}>
                            <p>{oferta.precoEspecial}</p>
                        </Col>
                        <Col xs={2}>
                            <p>Qtd: {oferta.quantidadeMinima}</p>
                        </Col>
                    </Row>
                ))}
            </Card.Body>
        </Card>
    ));

    return (
        <Container>
            <h1 className="text-center">Meus Pedidos</h1>
            <Row>
                <Col xs={12} md={8}>
                    {listaPedidosLI}
                </Col>
                <Col xs={12} md={4}>
                    <Card>
                        <Card.Body>
                            <h5>Resumo</h5>
                            <p>Total de Pedidos: {listaPedidos.length}</p>
                            <Button variant="warning" onClick={() => props.handlePage("home-cliente")} className="w-100">Continuar Comprando</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MeusPedidos;