import { environment } from "../constants/environment";
import { fetchApi } from "../utils/fetch";
import { getLocalStorage } from "../utils/storage";

export const getMenus = async (search?: string, category?: string, pageSize?: number) => {
    let url = `${environment.API_URL}/menu?page=1`;

    if (pageSize) {
        url += `&pageSize=${pageSize}` || `&pageSize=6`;
    }
    
    if (category) {
        url += `&category=${category}`;
    }

    if (search) {
        url += `&search=${search}`;
    }

    const result = await fetchApi(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getLocalStorage('auth')}`,
        },
    }).then((data) => data);

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