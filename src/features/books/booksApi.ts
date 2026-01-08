import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "@/lib/axios";
import type { Book, CreateBookDto, UpdateBookDto } from "./types";

const getBooks = async (): Promise<Array<Book>> => {
	const response = await apiClient.get<Array<Book>>("/books");
	return response.data;
};

const getBookById = async (id: string): Promise<Book> => {
	const response = await apiClient.get<Book>(`/books/${id}`);
	return response.data;
};

const createBook = async (newBook: CreateBookDto): Promise<Book> => {
	const response = await apiClient.post<Book>("/books", newBook);
	return response.data;
};

const updateBook = async ({
	id,
	data,
}: {
	id: string;
	data: UpdateBookDto;
}): Promise<Book> => {
	const response = await apiClient.put<Book>(`/books/${id}`, data);
	return response.data;
};

const deleteBook = async (id: string): Promise<void> => {
	await apiClient.delete(`/books/${id}`);
};

export const useBooks = (): UseQueryResult<Array<Book>, Error> => {
	return useQuery<Array<Book>, Error>({
		queryKey: ["books"],
		queryFn: getBooks,
	});
};

export const useBook = (id: string): UseQueryResult<Book, Error> => {
	return useQuery<Book, Error>({
		queryKey: ["books", id],
		queryFn: () => getBookById(id),
		enabled: !!id,
	});
};

export const useCreateBook = (): UseMutationResult<
	Book,
	Error,
	CreateBookDto
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation<Book, Error, CreateBookDto>({
		mutationFn: createBook,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["books"] });
			void navigate({ to: "/books" });
		},
	});
};

export const useUpdateBook = (): UseMutationResult<
	Book,
	Error,
	{ id: string; data: UpdateBookDto }
> => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation<Book, Error, { id: string; data: UpdateBookDto }>({
		mutationFn: updateBook,
		onSuccess: (updatedBook) => {
			void queryClient.invalidateQueries({ queryKey: ["books"] });
			queryClient.setQueryData(
				["books", updatedBook.id.toString()],
				updatedBook
			);
			void navigate({ to: "/books" });
		},
	});
};

export const useDeleteBook = (): UseMutationResult<void, Error, string> => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: deleteBook,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["books"] });
		},
	});
};
