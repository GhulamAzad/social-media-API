import { AxiosError } from "axios";
import { axiosClient } from "../utils/axios-client";

export const getCurrentUser = async (token: string | null) => {
    const res = await axiosClient.get('/me', { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
}


export const login = async ({ email, password }: { email: string, password: string }) => {
    try {
        const res = await axiosClient.post('/login', { email, password });
        return res.data;
    } catch (error: unknown) {
        let message = "Internal Server Error!";
        if (error instanceof AxiosError) {
            message = error.response?.data?.message ?? message;
        }
        throw new Error(message);
    }
}