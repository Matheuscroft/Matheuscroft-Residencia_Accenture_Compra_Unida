import React from "react";
import NavegacaoHeader from "../components/NavegacaoHeader";
import landingImg from "../assets/LandingPage.jpg";
import { Container, Row, Col, Button } from 'react-bootstrap';

const LandingPage = (props) => {
    return (
        <div style={{ height: '100vh', overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}>
            <NavegacaoHeader handlePage={props.handlePage} />
            <div style={{  
                position: 'absolute',
                top: '56px', // Altura do Navbar
                left: 0,
                right: 0,
                bottom: 0,
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center'
            }}>
                <div style={{
                    backgroundImage: `url(${landingImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.7, // Ajuste a opacidade conforme necessário
                    zIndex: -1
                }}></div>
                <Container>
                    <Row>
                        <Col>
                            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'black' }}>Unindo Microempreendedores e Fornecedores</h1>
                            <p style={{ fontSize: '1.5rem', marginTop: '20px', color: 'black' }}>Aproveite as melhores ofertas e condições de compra coletiva. Juntos, somos mais fortes!</p>
                            <Button style={{ 
                                backgroundColor: '#FFCD46', 
                                borderColor: '#FFCD46', 
                                color: 'black', 
                                marginTop: '20px', 
                                padding: '15px 30px', // Aumenta o padding
                                fontSize: '1.25rem', // Aumenta o tamanho da fonte
                                width: 'auto' // Ajusta a largura conforme necessário
                            }} onClick={() => props.handlePage("cadastro")}>Cadastre-se agora e impulsione seu negócio</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default LandingPage;