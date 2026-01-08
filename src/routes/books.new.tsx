import type React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBook } from "../features/books/booksApi.ts";
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
		.int("Year must be an integer")
		.min(1900, "Year must be 1900 or later")
		.max(new Date().getFullYear() + 1, "Year cannot be in the future"),
	location: z.string().min(2, "Location must be at least 2 characters"),
	status: z.enum([
		BookStatus.NEW,
		BookStatus.GOOD,
		BookStatus.DAMAGED,
		BookStatus.LOST,
	]),
});

type BookFormData = z.infer<typeof bookSchema>;

function CreateBookPage(): React.JSX.Element {
	const navigate = useNavigate();
	const createBookMutation = useCreateBook();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BookFormData>({
		resolver: zodResolver(bookSchema),
		defaultValues: {
			status: BookStatus.NEW,
			language: LanguageEnum.UKRAINIAN,
		},
	});

	const onSubmit = (data: BookFormData): void => {
		createBookMutation.mutate(data);
	};

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
				<h1 className="text-3xl font-bold text-gray-800">Add New Book</h1>
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
						placeholder="Enter book title"
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
						placeholder="Enter publisher name"
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
						htmlFor="language"
					>
						Language *
					</label>
					<select
						{...register("language")}
						id="language"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.language ? "border-red-500" : "border-gray-300"
						}`}
					>
						{Object.values(LanguageEnum).map((lang) => (
							<option key={lang} value={lang}>
								{lang}
							</option>
						))}
					</select>
					{errors.language && (
						<p className="mt-1 text-sm text-red-500">
							{errors.language.message}
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
						placeholder="2024"
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
						htmlFor="location"
					>
						Location *
					</label>
					<input
						{...register("location")}
						id="location"
						placeholder="Shelf A-15"
						type="text"
						className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							errors.location ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.location && (
						<p className="mt-1 text-sm text-red-500">
							{errors.location.message}
						</p>
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

				<div className="flex gap-4">
					<button
						className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
						disabled={createBookMutation.isPending}
						type="submit"
					>
						{createBookMutation.isPending ? "Creating..." : "Create Book"}
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

export const Route = createFileRoute("/books/new")({
	component: CreateBookPage,
});
