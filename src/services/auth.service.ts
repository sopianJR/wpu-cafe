import { environment } from "../constants/environment";
import { ILogin } from "../types/auth";
import { fetchApi } from "../utils/fetch";

export const login = async (payload: ILogin) => {
    const result = await fetchApi(`${environment.API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    return result;
};