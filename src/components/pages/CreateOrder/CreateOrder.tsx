import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ICart, IMenu } from "../../../types/order";
import { getMenus } from "../../../services/menu.service";
import { filters, tables } from "./CreateOrder.constants";
import { createOrder } from "../../../services/order.service";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Image,
  Badge,
  Pagination,
} from "react-bootstrap";
import useDebounce from "../../../hooks/useDebounce";

const CreateOrder = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [carts, setCarts] = useState<ICart[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getMenus(searchParams.get('category') as string, debouncedSearchTerm, page);
      setMenus(result.data);
      setTotalPage(result.metadata.totalPages || 1);
    };
    fetchMenu();
  }, [searchParams.get('category') as string, debouncedSearchTerm, page]);

  const handleAddToCart = (type: string, id: string, name: string) => {
    const itemIsInCart = carts.find((item: ICart) => item.menuId === id);
    if (type === "increment") {
      if (itemIsInCart) {
        setCarts(
          carts.map((item) =>
            item.menuId === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCarts([...carts, { menuId: id, name, quantity: 1 }]);
      }
    } else {
      if (itemIsInCart && itemIsInCart.quantity <= 1) {
        setCarts(carts.filter((item) => item.menuId !== id));
      } else {
        setCarts(
          carts.map((item) =>
            item.menuId === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    }
  };

  const handleOrder = async (event: FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const payload = {
      customerName: form.customerName.value,
      tableNumber: form.tableNumber.value,
      cart: carts.map((item: ICart) => ({
        menuItemId: item.menuId,
        quantity: item.quantity,
        notes: "",
      })),
    };

    await createOrder(payload);
    return navigate("/orders");
  };

  return (
    <Container fluid className="px-4 my-4">

      <h2 className="mb-3">Explore Our Best Menu</h2>


      {/* Row with Menu List and Order Form */}
      <Row>
        {/* Menu List */}
        <Col lg={8}>
          <Row>
            <Row className="g-3">
                <Col md={8}>
                    {/* Filter Buttons */}
                    <div className="mb-4 d-flex gap-2 flex-wrap">
                      {filters.map((filter) => (
                        <Button
                          key={filter}
                          variant={
                            (!searchParams.get("category") && filter === "All") ||
                            filter === searchParams.get("category")
                              ? "primary"
                              : "outline-secondary"
                          }
                          onClick={() =>
                            setSearchParams(filter === "All" ? {} : { category: filter })
                          }
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Search menu by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            {menus.map((item) => (
              <Col md={4} key={item.id} className="mb-4">
                <Card>
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fluid
                    style={{ height: 180, objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>${item.price}</strong>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handleAddToCart("increment", `${item.id}`, item.name)
                        }
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
          </Row>
        </Col>

        {/* Order Form */}
        <Col lg={4}>
          <Card className="p-3">
            <Form onSubmit={handleOrder}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Customer Information</h5>
                <Link to="/orders">
                  <Button variant="secondary" size="sm">
                    Cancel
                  </Button>
                </Link>
              </div>

              <Form.Group className="mb-3" controlId="customerName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  placeholder="Insert Name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="tableNumber">
                <Form.Label>Table Number</Form.Label>
                <Form.Select name="tableNumber" required>
                  <option value="">Select Table</option>
                  {tables.map((table) => (
                    <option key={table.value} value={table.value}>
                      {table.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <h6>Current Order</h6>
              {carts.length > 0 ? (
                <>
                  <div
                    style={{
                      maxHeight: 200,
                      overflowY: "auto",
                      marginBottom: "1rem",
                    }}
                  >
                    {carts.map((item) => (
                      <Card className="mb-2" key={item.menuId}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                          <div>{item.name}</div>
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleAddToCart("decrement",`${item.menuId}`, `${item.name}`)
                              }
                            >
                              -
                            </Button>
                            <Badge bg="secondary">{item.quantity}</Badge>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() =>
                                handleAddToCart("increment", `${item.menuId}`, `${item.name}`)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                  <Button type="submit" variant="primary" className="w-100">
                    Order
                  </Button>
                </>
              ) : (
                <p className="text-muted">Cart is empty</p>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOrder;
