import {ApiResponse, RefreshTokenDataResponse} from "@/helpers/shared/interfaces/apiInterface";
import LocalStorage from "@/helpers/utils/LocalStorage";
import axios, {AxiosError} from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = LocalStorage.getAccessToken();
        // Do something before request is sent
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Function lấy refresh token
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
                    LocalStorage.setAccessToken(newAccessToken);
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

export {apiClient};
