import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../../services/order.service";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Image,
  Button as BsButton,
} from "react-bootstrap";

const DetailOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>({});

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await getOrderById(id as string);
      setOrder(result);
    };
    fetchOrder();
  }, [id]);

  const getStatusVariant = (status: string) => {
    if (status === "COMPLETED") return "success";
    if (status === "PROCESSING") return "warning";
    return "secondary";
  };

  return (
    <Container className="my-4">
      <Row className="mb-3 justify-content-between align-items-center">
        <Col><h2>Detail Order</h2></Col>
        <Col className="text-end">
          <Link to="/orders">
            <BsButton variant="warning">Back</BsButton>
          </Link>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Customer Name:</strong>
              <div>{order.customer_name}</div>
            </Col>
            <Col md={6}>
              <strong>Table Number:</strong>
              <div>{order.table_number}</div>
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Grand Total:</strong>
              <div>${order.total}</div>
            </Col>
            <Col md={6}>
              <strong>Order Status:</strong>
              <div>
                <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h4>Order Items</h4>
      <Row>
        {order?.cart?.map((item: any) => (
          <Col md={6} lg={4} key={item.menuItemId} className="mb-3">
            <Card>
              <Card.Body className="d-flex gap-3 align-items-center">
                <Image
                  src={item.menuItem.image_url}
                  alt={item.menuItem.name}
                  thumbnail
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <div>
                  <div><strong>{item.quantity}x {item.menuItem.name}</strong></div>
                  <div>${parseInt(`${item.menuItem?.price}`) * item.quantity}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DetailOrder;
