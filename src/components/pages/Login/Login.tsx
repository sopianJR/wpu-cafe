import { FormEvent, useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Navbar, Nav} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { setLocalStorage } from '../../../utils/storage';
import { login } from '../../../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const payload = {
            email: form.email.value,
            password: form.password.value,
        };

        try {
            const result = await login(payload);
            setLocalStorage('auth', result.token);
            navigate('/orders');
        } catch (err: any) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <>
        {/* Navbar Section */}
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">WPU Cafe</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/#menu">Menu</Nav.Link>
                        <Nav.Link as={Link} to="/#reviews">Reviews</Nav.Link>
                        <Nav.Link as={Link} to="/#about">About</Nav.Link>
                        <Nav.Link as={Link} to="/#contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/">Kembali</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100" style={{ maxWidth: '400px' }}>
                <Col>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Login</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Insert Email" required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Insert Password" required />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                                
                            </Form>

                            <div className="text-center mt-3">
                                <Link to="/">Back to Home</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Login;
