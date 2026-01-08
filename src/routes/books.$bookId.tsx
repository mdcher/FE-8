import { useEffect } from "react";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBook, useUpdateBook } from "../features/books/booksApi.ts";
import { LanguageEnum, BookStatus } from "../features/books/types";

const bookSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	publisher: z.string().min(2, "Publisher must be at least 2 characters"),
	language: z.enum([
		LanguageEnum.UKRAINIAN,
		LanguageEnum.ENGLISH,
		LanguageEnum.GERMAN,
		LanguageEnum.FRENCH,
		LanguageEnum.SPANISH,
		LanguageEnum.ROMANIAN,
		LanguageEnum.SLOVAK,
	]),
	year: z
		.number()
		.int()
		.min(1900, "Year must be 1900 or later")
		.max(new Date().getFullYear() + 1),
	location: z.string().min(2, "Location must be at least 2 characters"),
	status: z.enum([
		BookStatus.NEW,
		BookStatus.GOOD,
		BookStatus.DAMAGED,
		BookStatus.LOST,
	]),
});

type BookFormData = z.infer<typeof bookSchema>;

function EditBookPage(): React.JSX.Element {
	const { bookId } = useParams({ from: "/books/$bookId" });
	const navigate = useNavigate();
	const { data: book, isLoading, isError } = useBook(bookId);
	const updateBookMutation = useUpdateBook();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<BookFormData>({
		resolver: zodResolver(bookSchema),
	});

	useEffect(() => {
		if (book) {
			reset({
				title: book.bookTitle,
				publisher: book.publisher,
				year: book.year,
				status: book.status,
				language: LanguageEnum.UKRAINIAN,
				location: "Unknown",
			});
		}
	}, [book, reset]);

	const onSubmit = (data: BookFormData): void => {
		updateBookMutation.mutate({ id: bookId, data });
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (isError || !book) {
		return (
			<div className="container mx-auto p-4">
				<div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					Book not found or failed to load.
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl p-4">
			<div className="mb-6">
				<button
					className="mb-4 text-blue-500 hover:text-blue-600"
					type="button"
					onClick={() => {
						void navigate({ to: "/books" });
					}}
				>
					← Back to Books
				</button>
				<h1 className="text-3xl font-bold text-gray-800">
					Edit Book: {book.bookTitle}
				</h1>
			</div>

			<form
				className="space-y-6 rounded-lg bg-white p-6 shadow-md"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<label
						className="mb-1 block text-sm font-medium text-gray-700"
						htmlFor="title"
					>
						Book Title *
					</label>
					<input
						{...register("title")}
						id="title"
						type="text"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.title ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.title && (
						<p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
					)}
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium text-gray-700"
						htmlFor="publisher"
					>
						Publisher *
					</label>
					<input
						{...register("publisher")}
						id="publisher"
						type="text"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.publisher ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.publisher && (
						<p className="mt-1 text-sm text-red-500">
							{errors.publisher.message}
						</p>
					)}
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium text-gray-700"
						htmlFor="year"
					>
						Year *
					</label>
					<input
						{...register("year", { valueAsNumber: true })}
						id="year"
						type="number"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.year ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.year && (
						<p className="mt-1 text-sm text-red-500">{errors.year.message}</p>
					)}
				</div>

				<div>
					<label
						className="mb-1 block text-sm font-medium text-gray-700"
						htmlFor="status"
					>
						Status *
					</label>
					<select
						{...register("status")}
						id="status"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.status ? "border-red-500" : "border-gray-300"
						}`}
					>
						{Object.values(BookStatus).map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
					{errors.status && (
						<p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
					)}
				</div>

				{book.history && book.history.length > 0 && (
					<div className="border-t pt-4">
						<h3 className="mb-3 text-lg font-semibold">Loan History</h3>
						<div className="space-y-2">
							{book.history.map((loan) => (
								<div key={loan.id} className="rounded bg-gray-50 p-3">
									<p className="text-sm">
										<span className="font-medium">Issue Date:</span>{" "}
										{loan.issueDate}
									</p>
									<p className="text-sm">
										<span className="font-medium">Due Date:</span>{" "}
										{loan.dueDate}
									</p>
									<p className="text-sm">
										<span className="font-medium">Returned:</span>{" "}
										{loan.isReturned ? "✓ Yes" : "✗ No"}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-4">
					<button
						className="flex-1 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:bg-gray-400"
						disabled={updateBookMutation.isPending}
						type="submit"
					>
						{updateBookMutation.isPending ? "Saving..." : "Save Changes"}
					</button>
					<button
						className="rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
						type="button"
						onClick={() => {
							void navigate({ to: "/books" });
						}}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export const Route = createFileRoute("/books/$bookId")({
	component: EditBookPage,
});
