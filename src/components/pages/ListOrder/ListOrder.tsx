import { useEffect, useState } from "react";
import { getOrders, updateOrder } from "../../../services/order.service";
import { Link, useNavigate } from "react-router-dom";
import { IOrder } from "../../../types/order";
import { removeLocalStorage } from "../../../utils/storage";
import useDebounce from "../../../hooks/useDebounce";

import {
    Container,
    Row,
    Col,
    Form,
    Table,
    Button as BsButton,
    Pagination,
    Stack,
    Card,
    Badge,
} from "react-bootstrap";

const ListOrder = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            const result = await getOrders(debouncedSearchTerm, statusFilter, page);
            setOrders(result.data);
            setTotalPage(result.metadata.totalPages || 1);
        };

        fetchOrder();
    }, [debouncedSearchTerm, statusFilter, page]);

    const handleCompleteOrder = async (id: string) => {
        await updateOrder(id, { status: "COMPLETED" });
        
        const result = await getOrders(debouncedSearchTerm, statusFilter, page);
        setOrders(result.data);
        setTotalPage(result.metadata.totalPages || 1);
    };

    const handleLogout = () => {
        removeLocalStorage("auth");
        return navigate("/");
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between mb-4">
                <h2 className="mb-0">Order List</h2>
                <Stack direction="horizontal" gap={2}>
                    <Link to="/create">
                        <BsButton variant="primary">Create Order</BsButton>
                    </Link>
                    <BsButton variant="outline-secondary" onClick={handleLogout}>
                        Logout
                    </BsButton>
                </Stack>
            </Stack>

            {/* Filter Form */}
            <Card className="mb-4">
                <Card.Body>
                    <Form>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by customer name..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="ALL">All</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="COMPLETED">Completed</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Table Order */}
            <Card>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Customer Name</th>
                                <th>Table</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={order.id}>
                                        <td className="text-center">{(page - 1) * 10 + index + 1}</td>
                                        <td>{order.customer_name}</td>
                                        <td className="text-center">{order.table_number}</td>
                                        <td className="text-center">${order.total}</td>
                                        <td className="text-center">
                                            <Badge
                                                bg={order.status === "PROCESSING" ? "warning" : "success"}
                                                text={order.status === "PROCESSING" ? "dark" : undefined}
                                                className="text-capitalize"
                                            >
                                                {order.status.toLowerCase()}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Stack direction="horizontal" gap={2} className="justify-content-center">
                                                <Link to={`/orders/${order.id}`}>
                                                    <BsButton size="sm" variant="info">Detail</BsButton>
                                                </Link>
                                                {order.status === "PROCESSING" && (
                                                    <BsButton
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => handleCompleteOrder(order.id)}
                                                    >
                                                        Complete
                                                    </BsButton>
                                                )}
                                            </Stack>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1}
                            />
                            {[...Array(totalPage)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === page}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
                                disabled={page === totalPage}
                            />
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ListOrder;
