import { createFileRoute, Link } from "@tanstack/react-router";
import { useBooks } from "../features/books/booksApi.ts";
import { BookStatus } from "../features/books/types";

function HomePage(): React.JSX.Element {
	const { data: books } = useBooks();

	// Статистика
	const totalBooks = books?.length || 0;
	const newBooks =
		books?.filter((b) => b.status === BookStatus.NEW).length || 0;
	const totalLoans =
		books?.reduce((accumulator, book) => accumulator + (book.history?.length || 0), 0) || 0;
	const activeLoans =
		books?.reduce(
			(accumulator, book) =>
				accumulator + (book.history?.filter((l) => !l.isReturned).length || 0),
			0
		) || 0;

	const stats = [
		{
			label: "Всього книг",
			value: totalBooks,
			icon: "📚",
			color: "from-blue-500 to-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			label: "Нові надходження",
			value: newBooks,
			icon: "✨",
			color: "from-green-500 to-green-600",
			bgColor: "bg-green-50",
		},
		{
			label: "Всього видач",
			value: totalLoans,
			icon: "📖",
			color: "from-purple-500 to-purple-600",
			bgColor: "bg-purple-50",
		},
		{
			label: "Активні видачі",
			value: activeLoans,
			icon: "🔄",
			color: "from-orange-500 to-orange-600",
			bgColor: "bg-orange-50",
		},
	];

	return (
		<div className="space-y-12 animate-in fade-in duration-700">
			{/* Hero Section */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 text-white shadow-2xl">
				{/* Decorative Elements */}
				<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
				<div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

				<div className="relative z-10">
					<div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
						🎉 Вітаємо в системі
					</div>
					<h1 className="mb-4 text-5xl font-bold leading-tight">
						Система управління
						<br />
						бібліотекою LibraryHub
					</h1>
					<p className="mb-8 max-w-2xl text-lg text-blue-100">
						Сучасний інструмент для ефективного управління книжковим фондом,
						відстеження видач та ведення статистики вашої бібліотеки.
					</p>
					<div className="flex gap-4">
						<Link
							className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
							to="/books"
						>
							🔍 Переглянути каталог
						</Link>
						<Link
							className="rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold backdrop-blur-sm transition-all hover:bg-white/20"
							to="/books/new"
						>
							➕ Додати книгу
						</Link>
					</div>
				</div>
			</div>

			{/* Statistics Grid */}
			<div>
				<h2 className="mb-6 text-2xl font-bold text-gray-800">
					📊 Статистика бібліотеки
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
							style={{
								animationDelay: `${index * 100}ms`,
							}}
						>
							{/* Background Gradient */}
							<div
								className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-5`}
							></div>

							<div className="relative z-10">
								<div
									className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${stat.bgColor} text-3xl`}
								>
									{stat.icon}
								</div>
								<div className="mb-1 text-sm font-medium text-gray-600">
									{stat.label}
								</div>
								<div
									className={`bg-gradient-to-r ${stat.color} bg-clip-text text-4xl font-bold text-transparent`}
								>
									{stat.value}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Features Section */}
			<div>
				<h2 className="mb-6 text-2xl font-bold text-gray-800">
					⚡ Можливості системи
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[
						{
							icon: "📚",
							title: "Управління каталогом",
							description:
								"Додавайте, редагуйте та видаляйте книги з простим інтерфейсом",
							color: "blue",
						},
						{
							icon: "🔍",
							title: "Пошук та фільтрація",
							description:
								"Швидко знаходьте потрібні книги за різними параметрами",
							color: "green",
						},
						{
							icon: "📊",
							title: "Статистика видач",
							description:
								"Відстежуйте історію видач кожної книги в режимі реального часу",
							color: "purple",
						},
						{
							icon: "🏷️",
							title: "Статуси книг",
							description:
								"Контролюйте стан книг: нова, хороша, пошкоджена, втрачена",
							color: "orange",
						},
						{
							icon: "📍",
							title: "Локації",
							description:
								"Зберігайте інформацію про місцезнаходження кожної книги",
							color: "pink",
						},
						{
							icon: "🔐",
							title: "Безпека даних",
							description:
								"JWT авторизація та захист від несанкціонованого доступу",
							color: "red",
						},
					].map((feature, index) => (
						<div
							key={feature.title}
							className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-transparent hover:shadow-lg"
							style={{
								animationDelay: `${index * 100}ms`,
							}}
						>
							<div className="mb-4 text-4xl">{feature.icon}</div>
							<h3 className="mb-2 text-lg font-semibold text-gray-800">
								{feature.title}
							</h3>
							<p className="text-sm text-gray-600">{feature.description}</p>
						</div>
					))}
				</div>
			</div>

			{/* Call to Action */}
			<div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white shadow-2xl">
				<h2 className="mb-4 text-3xl font-bold">Готові почати роботу?</h2>
				<p className="mb-8 text-lg text-blue-100">
					Перегляньте каталог книг або додайте нову книгу до системи
				</p>
				<div className="flex justify-center gap-4">
					<Link
						className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:scale-105"
						to="/books"
					>
						📚 Відкрити каталог
					</Link>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
