import {AxiosRequestConfig} from "axios";
import {apiClient} from "./apiClient";
import {ApiResponse} from "@/helpers/shared/interfaces/apiInterface";

export default async function requestHandler<D>(options: AxiosRequestConfig): Promise<ApiResponse<D> | null> {
    try {
        const response = (await apiClient(options)).data as ApiResponse<D>;

        return response;
    } catch (err) {
        console.log("🚀 ~ err:", err);
        return null;
    }
}
