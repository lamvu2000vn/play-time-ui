import {ApiResponse, RefreshTokenDataResponse} from "@/helpers/shared/interfaces/apiInterface";
import axios, {AxiosError} from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
});

export const setDefaultAccessToken = (accessToken: string) => {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

// Get new access token
const refreshAccessToken = async (): Promise<string | null> => {
    const response = await axios<Promise<ApiResponse<RefreshTokenDataResponse>>>({
        url: process.env.NEXT_PUBLIC_API_URL + "/auth/token",
        method: "POST",
        withCredentials: true,
    }).then((res) => res.data);

    if (response.status !== 200) throw new Error("Failed to refresh access token");

    return response.data.accessToken;
};

// Interceptor cho response để xử lý lỗi 401
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                if (newAccessToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    setDefaultAccessToken(newAccessToken);
                    return apiClient(originalRequest);
                }
            } catch (refreshError: unknown) {
                if (refreshError instanceof AxiosError && refreshError.response?.status === 401) {
                    return Promise.reject(refreshError);
                }

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
