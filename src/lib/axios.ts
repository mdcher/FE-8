import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Додаємо токен до кожного запиту
apiClient.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Обробляємо відповіді та помилки
apiClient.interceptors.response.use(
	(response) => {
		// Якщо бекенд огортає дані в data.data (часта практика)
		if (response.data && response.data.data) {
			return { ...response, data: response.data.data };
		}
		return response;
	},
	(error) => {
		// Якщо прийшла помилка 401 (Unauthorized) - виходимо з системи
		if (error.response?.status === 401) {
			useAuthStore.getState().logout();
		}
		return Promise.reject(error);
	}
);

export default apiClient;
