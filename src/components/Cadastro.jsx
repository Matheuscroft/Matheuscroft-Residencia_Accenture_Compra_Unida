import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ClienteImg from '../assets/Cliente.jpg';
import FornecedorImg from '../assets/Fornecedor.jpg';

const Cadastro = (props) => {
    return (
        <div>
            <Container style={{ marginTop: '20px' }}>
                <Row className="mb-4">
                    <Col className="d-flex justify-content-center">
                        <h1>CADASTRE-SE</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card className="mb-4" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                            <Card.Img variant="top" src={ClienteImg} />
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("cadastro-cliente")}>Eu Sou Empreendedor</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mb-4" style={{ backgroundColor: '#1c3bc5', borderRadius: '15px', borderColor: '#d4edda' }}>
                            <Card.Img variant="top" src={FornecedorImg} />
                            <Card.Body className="d-flex flex-column align-items-center">
                                <Button className='botao-cadastrar mb-3 align-self-center' style={{ backgroundColor: '#FFCD46', borderColor: '#FFCD46', color: 'black' }} onClick={() => props.handlePage("cadastro-fornecedor")}>Eu Sou Fornecedor</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Cadastro;

