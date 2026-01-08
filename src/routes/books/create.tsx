import type * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBook } from "@/features/books/booksApi.ts";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CreateBookDto } from "@/features/books/types";

const createBookSchema = z.object({
	title: z.string().min(1, "Назва обов'язкова"),
	author: z.string().min(1, "Автор обов'язковий"),
	isbn: z.string().min(5, "ISBN обов'язковий"),
	year: z.coerce.number().min(1000, "Некоректний рік"),
	totalCopies: z.coerce.number().min(1, "Мінімум 1 книга"),
	publisher: z.string().min(1, "Вкажіть видавництво"),
	language: z.string().min(1, "Вкажіть мову"),
	location: z.string().min(1, "Вкажіть локацію"),
	status: z.string().default("AVAILABLE"),
	description: z.string().optional(),
});

type CreateBookForm = z.infer<typeof createBookSchema>;

function CreateBookPage(): React.JSX.Element {
	const navigate = useNavigate();
	const createMutation = useCreateBook();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateBookForm>({
		resolver: zodResolver(
			createBookSchema
		) as unknown as Resolver<CreateBookForm>,
		defaultValues: {
			title: "",
			author: "",
			isbn: "",
			publisher: "",
			location: "",
			description: "",
			totalCopies: 1,
			year: new Date().getFullYear(),
			language: "English",
			status: "AVAILABLE",
		},
	});

	const onSubmit = (data: CreateBookForm): void => {
		const payload: CreateBookDto = {
			bookTitle: data.title,
			author: data.author,
			isbn: data.isbn,
			year: Number(data.year),
			totalCopies: Number(data.totalCopies),
			publisher: data.publisher,
			language: data.language,
			location: data.location,
			status: data.status,
			description: data.description || "",
		};

		createMutation.mutate(payload, {
			onSuccess: () => {
				void navigate({ to: "/books" });
			},
		});
	};

	const inputClass =
		"w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
	const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";
	const errorClass = "mt-1 text-xs text-red-500";

	return (
		<div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-3xl font-bold text-slate-900">Нова книга</h1>
				<Link
					className="text-sm font-medium text-slate-500 hover:text-indigo-600"
					to="/books"
				>
					Скасувати
				</Link>
			</div>

			<div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-900/5">
				<div className="bg-slate-50/50 p-6 sm:p-8">
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						{/* Назва та Автор */}
						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<label className={labelClass} htmlFor="title">
									Назва книги
								</label>
								<input
									className={inputClass}
									id="title"
									{...register("title")}
								/>
								{errors.title && (
									<p className={errorClass}>{errors.title.message}</p>
								)}
							</div>
							<div>
								<label className={labelClass} htmlFor="author">
									Автор
								</label>
								<input
									className={inputClass}
									id="author"
									{...register("author")}
								/>
								{errors.author && (
									<p className={errorClass}>{errors.author.message}</p>
								)}
							</div>
						</div>

						{/* Видавництво, Рік, Мова */}
						<div className="grid gap-6 md:grid-cols-3">
							<div>
								<label className={labelClass} htmlFor="publisher">
									Видавництво
								</label>
								<input
									className={inputClass}
									id="publisher"
									{...register("publisher")}
								/>
								{errors.publisher && (
									<p className={errorClass}>{errors.publisher.message}</p>
								)}
							</div>
							<div>
								<label className={labelClass} htmlFor="year">
									Рік
								</label>
								<input
									className={inputClass}
									id="year"
									type="number"
									{...register("year")}
								/>
								{errors.year && (
									<p className={errorClass}>{errors.year.message}</p>
								)}
							</div>
							<div>
								<label className={labelClass} htmlFor="language">
									Мова
								</label>
								<select
									className={inputClass}
									id="language"
									{...register("language")}
								>
									<option value="English">English</option>
									<option value="Ukrainian">Ukrainian</option>
									<option value="German">German</option>
									<option value="French">French</option>
								</select>
								{errors.language && (
									<p className={errorClass}>{errors.language.message}</p>
								)}
							</div>
						</div>

						{/* ISBN, Локація, Кількість */}
						<div className="grid gap-6 md:grid-cols-3">
							<div>
								<label className={labelClass} htmlFor="isbn">
									ISBN
								</label>
								<input className={inputClass} id="isbn" {...register("isbn")} />
								{errors.isbn && (
									<p className={errorClass}>{errors.isbn.message}</p>
								)}
							</div>
							<div>
								<label className={labelClass} htmlFor="location">
									Локація
								</label>
								<input
									className={inputClass}
									id="location"
									{...register("location")}
									placeholder="A-1"
								/>
								{errors.location && (
									<p className={errorClass}>{errors.location.message}</p>
								)}
							</div>
							<div>
								<label className={labelClass} htmlFor="totalCopies">
									Кількість
								</label>
								<input
									className={inputClass}
									id="totalCopies"
									type="number"
									{...register("totalCopies")}
								/>
								{errors.totalCopies && (
									<p className={errorClass}>{errors.totalCopies.message}</p>
								)}
							</div>
						</div>

						{/* Опис */}
						<div>
							<label className={labelClass} htmlFor="description">
								Опис
							</label>
							<textarea
								className={inputClass}
								id="description"
								rows={3}
								{...register("description")}
							/>
						</div>

						{/* Кнопка */}
						<div className="pt-4">
							<button
								className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 disabled:opacity-70"
								disabled={createMutation.isPending}
								type="submit"
							>
								{createMutation.isPending ? "Збереження..." : "Створити книгу"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/books/create")({
	component: CreateBookPage,
});
