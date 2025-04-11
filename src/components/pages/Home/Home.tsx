import { Form, Link, useSearchParams } from "react-router-dom";
// import styles from './Home.module.css';
import { Container, Row, Col, Card, Navbar, Nav, FormControl } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { IMenu, IReview } from "../../../types/order";
import { getMenus, getReviews } from "../../../services/menu.service";


const Home = () => {
    const [menus, setMenus] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search') as string || '';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchMenu = async () => {
            const result = await getMenus(searchParams.get('category') as string, search);
            setMenus(result.data);
        };
        fetchMenu();
    }, [searchParams.get('category'), search]);

    useEffect(() => {
        const fetchReview = async () => {
            const pageSize = parseInt(searchParams.get('pageSize') || '6', 10);
            const result = await getReviews(pageSize);
            setReviews(result.data);
        };
        fetchReview();
    }, [searchParams.get('pageSize')]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchParams((prev) => {
                if (searchTerm) {
                    prev.set('search', searchTerm);
                } else {
                    prev.delete('search');
                }
                return prev;
            });
        }, 500);
    
        return () => clearTimeout(timeout);
    }, [searchTerm]);    
    
    return (
        <>
            {/* Navbar Section */}
            <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Container>
                    <Navbar.Brand as={Link} to="/">FriendZone Cafe</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#menu">Menu</Nav.Link>
                            <Nav.Link href="#reviews">Reviews</Nav.Link>
                            <Nav.Link href="#about">About</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <Container fluid className="p-0">
                <div className="bg-dark text-white text-center py-5">
                    <h1>Welcome to FriendZone Cafe</h1>
                    <p className="lead">Delicious food, cozy atmosphere, and great service!</p>
                </div>

                {/* Menu Highlights */}
                <Container className="my-5" id="menu">
                    <h2 className="text-center mb-4">Our Popular Menu</h2>
                    <Form className="mb-4 d-flex justify-content-center">
                        <FormControl
                            type="text"
                            name="search"
                            placeholder="Search menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                    </Form>

                    <Row>
                        {menus.map((menu: IMenu) => (
                            <Col md={4} key={menu.id}>
                                <Card className="mb-3">
                                    <Card.Img
                                        variant="top"
                                        src={menu.image_url}
                                        alt={menu.name}
                                        className="menu-image"
                                    />
                                    <Card.Body>
                                        <Card.Title>{menu.name}</Card.Title>
                                        <Card.Text>${menu.price.toFixed(2)}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>

                {/* Customer Reviews Section */}
                <div className="bg-light py-5" id="reviews">
                    <Container>
                        <h2 className="text-center mb-4">What Our Customers Say</h2>
                        <Row>
                            {reviews.map((review: IReview) => (
                                <Col md={4} key={review.id}>
                                    <Card className="mb-3">
                                        <Card.Body>
                                            <Card.Title>{review.reviewer_name}</Card.Title>
                                            <Card.Text>"{review.comment}"</Card.Text>
                                            <Card.Text>Rating: {review.rating} / 5</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>

                {/* About Section */}
                <div className="bg-light py-5" id="about">
                    <Container>
                        <h2 className="text-center mb-4">About Us</h2>
                        <p className="text-center">
                            At FriendZone Cafe, we are passionate about serving the best coffee and food in town.
                            Come and enjoy a relaxing atmosphere with your friends and family.
                        </p>
                    </Container>
                </div>

                {/* Contact Section */}
                <div className="bg-light py-5" id="contact">
                    <Container>
                        <h2 className="text-center mb-4">Contact Us</h2>
                        <p className="text-center">
                            Email: contact@friendzonecafe.com | Phone: +123 456 7890
                        </p>
                    </Container>
                </div>

                {/* Footer */}
                <footer className="bg-dark text-white text-center py-3">
                    <p>&copy; 2025 FriendZone Cafe. All rights reserved.</p>
                </footer>
            </Container>
        </>
    );
};

export default Home;