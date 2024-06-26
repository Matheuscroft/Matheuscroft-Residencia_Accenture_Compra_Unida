import React, { useState, useEffect } from 'react';
import EditarProdutoModal from './EditarProdutoModal';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { getProdutos, getOfertas, deletarProduto, deletarOferta, editarProduto, editarOferta, deletarImagem } from "../auth/firebaseService";
import {ordenarPorDataString} from "./Utils"

const HomeFornecedor = (props) => {
    const [listaProdutos, setListaProdutos] = useState([]);
    const [listaOfertas, setListaOfertas] = useState([]);
    const [selectedEntidade, setSelectedEntidade] = useState(null);
    const [showEditarModal, setShowEditarModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const userId = props.userId;

        const fetchProdutos = async () => {
            const produtos = await getProdutos();
            const produtosFiltrados = produtos.filter(produto => produto.userId === userId);
            const produtosOrdenados = ordenarPorDataString(produtosFiltrados, 'dataCriacao');
            setListaProdutos(produtosOrdenados);
        };
    
        const fetchOfertas = async () => {
            const ofertas = await getOfertas();
            const ofertasFiltradas = ofertas.filter(oferta => oferta.userId === userId);
            const ofertasOrdenadas = ordenarPorDataString(ofertasFiltradas, 'dataCriacao');
            setListaOfertas(ofertasOrdenadas);
        };
    
        fetchProdutos();
        fetchOfertas();
    }, [/*props.userId*/]);
    

    const excluirItem = async (elementoID, tipo) => {
        if (tipo === 'produto') {
            const produto = listaProdutos.find(elemento => elemento.id === elementoID);
            if (produto && Array.isArray(produto.imagens)) {
                 await Promise.all(produto.imagens.map(imagemUrl => deletarImagem(imagemUrl)));
            }
            await deletarProduto(elementoID);
            const novaListaProdutos = listaProdutos.filter(elemento => elemento.id !== elementoID);
            setListaProdutos(novaListaProdutos);
        } else if (tipo === 'oferta') {
            await deletarOferta(elementoID);
            const novaListaOfertas = listaOfertas.filter(elemento => elemento.id !== elementoID);
            setListaOfertas(novaListaOfertas);
        }
    };

    const handleEditEntidade = (entidade) => {
        setSelectedEntidade(entidade);
        setShowEditarModal(true);
    };

    const handleSalvarProdutoEditado = async (entidadeEditada) => {

  
        if (entidadeEditada.tipo === "produto") {

            console.log("entrou em produto")
            console.log(entidadeEditada)
          
            await editarProduto(entidadeEditada.id, entidadeEditada);

            const novaListaProdutos = listaProdutos.map(produto =>
                produto.id === entidadeEditada.id ? entidadeEditada : produto
            );

            setListaProdutos(novaListaProdutos);

            const ofertasRelacionadas = listaOfertas.filter(oferta => oferta.produtoRelacionado.id === entidadeEditada.id);

            for (const oferta of ofertasRelacionadas) {
                
                const novaOferta = {
                    ...oferta,
                    produtoRelacionado: entidadeEditada
                };

                await editarOferta(novaOferta.id, novaOferta);

                const novaListaOfertas = listaOfertas.map(ofertaItem =>
                    ofertaItem.id === novaOferta.id ? novaOferta : ofertaItem
                );

                setListaOfertas(novaListaOfertas);
            }
            setAlertMessage('Produto editado com sucesso!');

        } else if (entidadeEditada.tipo === "oferta") {

            await editarOferta(entidadeEditada.id, entidadeEditada);

            const novaListaOfertas = listaOfertas.map(oferta =>
                oferta.id === entidadeEditada.id ? entidadeEditada : oferta
            );

            console.log("novaListaOfertas")
            console.log(novaListaOfertas)

            setListaOfertas(novaListaOfertas)
            
            setAlertMessage('Oferta editada com sucesso!');
        }

        

        setShowEditarModal(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const listaProdutosLI = listaProdutos.map((produto) => (
        <Card key={produto.id} className="mb-3" style={{ borderColor: '#1c3bc5', borderWidth: '2px' }}>
            <Card.Body className="d-flex align-items-center">
                {produto.imagens && produto.imagens.length > 0 && (
                    <img src={produto.imagens[0]} alt={produto.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                )}
                <div className="flex-grow-1">
                    <h5>{truncateText(produto.nomeProduto, 20)}</h5>
                    <p>{truncateText(produto.descricao, 50)}</p>
                    <p>{produto.preco}</p>
                </div>
                <div className="ms-auto" style={{minWidth: "fit-content"}}>
                
                    <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...produto, tipo: "produto" })} className="ms-2">Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => excluirItem(produto.id, 'produto')} className="ms-2">X</Button>
                </div>
            </Card.Body>
        </Card>
    ));

    const listaOfertasLI = listaOfertas.map((oferta) => {
        const produtoRelacionado = listaProdutos.find(produto => produto.id === oferta.produtoRelacionado.id);
        return (
            <Card key={oferta.id} className="mb-3" style={{ borderColor: '#1c3bc5', borderWidth: '2px' }}>
                <Card.Body className="d-flex align-items-center">
                    {produtoRelacionado && produtoRelacionado.imagens && produtoRelacionado.imagens.length > 0 && (
                        <img src={produtoRelacionado.imagens[0]} alt={produtoRelacionado.nomeProduto} style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    )}
                    <div className="flex-grow-1">
                        <h5>{truncateText(oferta.nomeOferta, 20)}</h5>
                        <p>{truncateText(oferta.descricao, 50)}</p>
                        <p>{oferta.precoEspecial}</p>
                    </div>
                    <div className="ms-auto" style={{minWidth: "fit-content"}}>
                        <Button variant="warning" size="sm" onClick={() => handleEditEntidade({ ...oferta, tipo: "oferta" })} className="ms-2">Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => excluirItem(oferta.id, 'oferta')} className="ms-2">X</Button>
                    </div>
                </Card.Body>
            </Card>
        );
    });

    return (
        <div>
            <Container style={{ marginTop: '20px' }}>
                {showAlert && (
                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Row className="mb-4">
                    <Col className="d-flex justify-content-center">
                        <Button
                            variant="warning"
                            onClick={() => props.handlePage("gerenciar-pedidos", { userId: props.userId })}
                            style={{ marginTop: '20px', width: '100%' }}
                        >
                            Ver Pedidos
                        </Button>
                    </Col>
                    <Col className="d-flex justify-content-center">
                        <Button
                            variant="warning"
                            onClick={() => props.handlePage("paineis", { userId: props.userId })}
                            style={{ marginTop: '20px', width: '100%' }}
                        >
                            Painel de Informações
                        </Button>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <Card className="mb-4" style={{ borderColor: '#1c3bc5', borderWidth: '2px' }}>
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Button
                                    className='botao-cadastrar'
                                    style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black', width: '50%' }}
                                    onClick={() => props.handlePage("criar-produto", { userId: props.userId })}
                                >
                                    ADICIONAR PRODUTO
                                </Button>
                                <h5>Lista de Produtos</h5>
                                <div style={{ minHeight: listaProdutos.length > 8 ? '600px' : 'auto', overflowY: listaProdutos.length > 8 ? 'auto' : 'visible', width: '100%' }}>
                                    {listaProdutosLI}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mb-4" style={{ borderColor: '#1c3bc5', borderWidth: '2px' }}>
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Button
                                    className='botao-cadastrar'
                                    style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black', width: '50%' }}
                                    onClick={() => props.handlePage("criar-oferta", { userId: props.userId })}
                                >
                                    ADICIONAR OFERTA
                                </Button>
                                <h5>Lista de Ofertas</h5>
                                <div style={{ maxHeight: listaOfertas.length > 8 ? '600px' : 'auto', overflowY: listaOfertas.length > 8 ? 'auto' : 'visible', width: '100%' }}>
                                    {listaOfertasLI}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {selectedEntidade && (
                <EditarProdutoModal
                    show={showEditarModal}
                    entidade={selectedEntidade}
                    onHide={() => setShowEditarModal(false)}
                    onSave={handleSalvarProdutoEditado}
                />
            )}
        </div>
    );
};

export default HomeFornecedor;