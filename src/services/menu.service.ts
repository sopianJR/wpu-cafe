import { environment } from "../constants/environment";
import { fetchApi } from "../utils/fetch";
import { getLocalStorage } from "../utils/storage";

export const getMenus = async (
    category?: string,
    search?: string,
    page: number = 1,
    pageSize: number = 6,
  ) => {
    const query = new URLSearchParams();
  
    query.append("page", page.toString());
    query.append("pageSize", pageSize.toString());
    if (search) query.append("search", search);
    if (category) query.append("category", category);
  
    const url = `${environment.API_URL}/menu?${query.toString()}`;
  
    const result = await fetchApi(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getLocalStorage("auth")}`,
      },
    });
  
    return result;
};  


export const getReviews = async (pageSize?: number) => {
    let url = `${environment.API_URL}/reviews?page=1&sortOrder=desc`;

    if (pageSize) {
        url += `&pageSize=${pageSize}` || `&pageSize=6`;
    }

    const result = await fetchApi(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getLocalStorage('auth')}`,
        },
    }).then((data) => data);

    return result;
};