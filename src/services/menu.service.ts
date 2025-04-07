import { environment } from "../constants/environment";
import { fetchApi } from "../utils/fetch";
import { getLocalStorage } from "../utils/storage";

export const getMenus = async (category?: string) => {
    let url = `${environment.API_URL}/menu?page=1&pageSize=25`;

    if (category) {
        url += `&category=${category}`;
    }

    const result = await fetchApi(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getLocalStorage('auth')}`,
        },
    }).then((data) => data);

    return result;
};