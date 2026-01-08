import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

// Схема валідації форми
export const loginSchema = z.object({
	email: z.string().email("Невірний формат email"),
	password: z.string().min(6, "Мінімум 6 символів"),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Тип відповіді від сервера
interface LoginResponse {
	token: string;
	user?: {
		id: number;
		email: string;
	};
}

// Функція запиту
const login = async (data: LoginDto): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>("/auth/login", data);
	return response.data;
};

// React Query Хук
export const useLogin = (): UseMutationResult<
	LoginResponse,
	Error,
	LoginDto
> => {
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);

	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setToken(data.token); // Зберігаємо токен
			void navigate({ to: "/" }); // Переходимо на головну
		},
		onError: (error: Error) => {
			// Тут можна додати toast notification
			console.error("Login failed:", error);
			alert("Невірний email або пароль");
		},
	});
};
