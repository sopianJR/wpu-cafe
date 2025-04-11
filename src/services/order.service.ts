import { environment } from "../constants/environment";
import { ICart } from "../types/order";
import { fetchApi } from "../utils/fetch";
import { getLocalStorage } from "../utils/storage";

export const getOrders = async (
    search?: string,
    status?: string,
    page: number = 1
  ) => {
    const query = new URLSearchParams();
  
    query.append("page", page.toString());
    query.append("pageSize", "10");
    if (search) query.append("search", search);
    if (status && status !== "ALL") query.append("status", status);
  
    const url = `${environment.API_URL}/orders?${query.toString()}`;
  
    const result = await fetchApi(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocalStorage("auth")}`,
      },
    });
  
    return result;
};  

export const updateOrder = async (
  id: string,
  payload: { status: string }
) => {
  const result = await fetchApi(`${environment.API_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getLocalStorage("auth")}`,
    },
    body: JSON.stringify(payload),
  });

  return result;
};

export const getOrderById = async (id: string) => {
  const url = `${environment.API_URL}/orders/${id}`;
  const result = await fetchApi(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getLocalStorage("auth")}`,
    },
  });

  return result;
};

export const createOrder = async (payload: {
  customerName: string;
  tableNumber: number;
  cart: ICart[];
}) => {
  const result = await fetchApi(`${environment.API_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getLocalStorage("auth")}`,
    },
    body: JSON.stringify(payload),
  });

  return result;
};
