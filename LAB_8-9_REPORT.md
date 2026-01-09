# Звіт: Лабораторно-практична робота №8–9
## Full-stack інтеграція: розробка UI на базі професійного бойлерплейту

**Виконав:** [Ваше ім'я]
**Група:** [Ваша група]
**Дата:** 08.01.2026

---

## Зміст
1. [Опис проєкту](#опис-проєкту)
2. [Використані технології](#використані-технології)
3. [Налаштування проєкту](#налаштування-проєкту)
4. [Реалізовані функції](#реалізовані-функції)
5. [Приклади коду](#приклади-коду)
6. [Скріншоти](#скріншоти)
7. [Складнощі та їх вирішення](#складнощі-та-їх-вирішення)
8. [Висновки](#висновки)

---

## Опис проєкту

**LibraryHub** — це система управління бібліотекою з повним CRUD функціоналом для книг. Проєкт демонструє професійний підхід до Full-stack інтеграції з використанням сучасного React-екосистеми та TypeScript.

### Основний функціонал:
- ✅ Перегляд каталогу книг з пошуком та фільтрацією
- ✅ Додавання нових книг до системи
- ✅ Редагування інформації про книги
- ✅ Видалення книг з підтвердженням
- ✅ Авторизація через JWT токен
- ✅ Валідація форм на стороні клієнта
- ✅ Responsive дизайн

---

## Використані технології

### Frontend Stack:
- **React 19.2** — UI бібліотека
- **TypeScript 5.9** — типізація
- **Vite 7.2** — build tool
- **TanStack Router 1.139** — файловий роутинг
- **TanStack Query 5.90** — управління серверним станом
- **React Hook Form 7.68** — управління формами
- **Zod 4.1** — валідація схем
- **Zustand 5.0** — глобальний стан (auth)
- **Axios 1.13** — HTTP клієнт
- **Tailwind CSS 3.4** — стилізація

### DevTools:
- TanStack Query Devtools
- TanStack Router Devtools
- React Hook Form DevTools
- ESLint + Prettier

---

## Налаштування проєкту

### 1. Клонування та встановлення залежностей

```bash
git clone [repository-url]
cd vite-react-boilerplate1
pnpm install
```

### 2. Налаштування змінних оточення

Створіть файл `.env` на основі `.env.example`:

```env
VITE_APP_ENVIRONMENT="development"
VITE_API_BASE_URL="http://localhost:4000/v1"
VITE_API_AUTH_TOKEN="your_jwt_token_here"
```

### 3. Запуск проєкту

```bash
# Запуск dev сервера
pnpm run dev

# Збірка для production
pnpm run build

# Лінтинг
pnpm run lint

# Тести
pnpm run test
```

---

## Реалізовані функції

### 1. Налаштування API клієнта (Axios)

**Файл:** `src/lib/axios.ts`

Створено централізований Axios інстанс з:
- Base URL з environment змінних
- Request interceptor для додавання JWT токену
- Response interceptor для обробки помилок та автоматичного logout

### 2. TanStack Query для управління даними

**Файл:** `src/features/books/booksApi.ts`

Реалізовано всі CRUD операції через React Query hooks:
- `useBooks()` — отримання списку книг
- `useBook(id)` — отримання однієї книги
- `useCreateBook()` — створення книги
- `useUpdateBook()` — оновлення книги
- `useDeleteBook()` — видалення книги

### 3. TanStack Router для навігації

**Структура маршрутів:**
```
/                       → Головна сторінка (index.tsx)
/books                  → Список книг (books.tsx)
/books/create           → Форма створення (books/create.tsx)
/books/:bookId          → Форма редагування (books.$bookId.tsx)
/login                  → Авторизація (login.tsx)
```

### 4. Форми з валідацією (React Hook Form + Zod)

Всі форми використовують:
- React Hook Form для управління станом
- Zod для схем валідації
- zodResolver для інтеграції
- Відображення помилок валідації в реальному часі

### 5. Авторизація

**Файли:**
- `src/features/auth/api.ts` — login mutation
- `src/store/authStore.ts` — Zustand store для токену
- `src/lib/axios.ts` — interceptor для авторизації

---

## Приклади коду

### 1. Axios Configuration

**Файл:** `src/lib/axios.ts`

```typescript
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor - додаємо токен
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

// Response interceptor - обробляємо помилки
apiClient.interceptors.response.use(
	(response) => {
		// Розпаковуємо вкладені дані
		if (response.data && response.data.data) {
			return { ...response, data: response.data.data };
		}
		return response;
	},
	(error) => {
		// Автоматичний logout при 401
		if (error.response?.status === 401) {
			useAuthStore.getState().logout();
		}
		return Promise.reject(error);
	}
);

export default apiClient;
```

**Ключові моменти:**
- ✅ Base URL з `import.meta.env` (не захардкоджений)
- ✅ Токен додається централізовано
- ✅ Автоматична обробка 401 помилок
- ✅ Розпаковка nested responses

---

### 2. TanStack Query Hooks

**Файл:** `src/features/books/booksApi.ts`

```typescript
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

// API функції
const getBooks = async (): Promise<Array<Book>> => {
	const response = await apiClient.get<Array<Book>>("/books");
	return response.data;
};

const createBook = async (newBook: CreateBookDto): Promise<Book> => {
	const response = await apiClient.post<Book>("/books", newBook);
	return response.data;
};

// Query Hook - отримання списку
export const useBooks = (): UseQueryResult<Array<Book>, Error> => {
	return useQuery<Array<Book>, Error>({
		queryKey: ["books"],
		queryFn: getBooks,
	});
};

// Mutation Hook - створення книги
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
			// Інвалідуємо кеш - автоматичне оновлення списку
			void queryClient.invalidateQueries({ queryKey: ["books"] });
			// Перехід на список
			void navigate({ to: "/books" });
		},
	});
};
```

**Ключові моменти:**
- ✅ Типізовані hooks з `UseQueryResult` та `UseMutationResult`
- ✅ Query keys для кешування: `['books']`, `['books', id]`
- ✅ `invalidateQueries` для автоматичного оновлення UI
- ✅ Навігація після успішної мутації
- ✅ Немає `useEffect` для fetch даних

---

### 3. Zod Validation Schema

**Файл:** `src/routes/books/create.tsx`

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема валідації
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

// Автоматичний TypeScript тип з схеми
type CreateBookForm = z.infer<typeof createBookSchema>;

function CreateBookPage() {
	const createMutation = useCreateBook();

	// React Hook Form з Zod resolver
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateBookForm>({
		resolver: zodResolver(createBookSchema),
		defaultValues: {
			totalCopies: 1,
			year: new Date().getFullYear(),
			status: "AVAILABLE",
		},
	});

	const onSubmit = (data: CreateBookForm): void => {
		const payload: CreateBookDto = {
			bookTitle: data.title,
			author: data.author,
			isbn: data.isbn,
			// ... mapping полів
		};
		createMutation.mutate(payload);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input {...register("title")} />
			{errors.title && <p>{errors.title.message}</p>}

			<button
				type="submit"
				disabled={createMutation.isPending}
			>
				{createMutation.isPending ? "Збереження..." : "Створити"}
			</button>
		</form>
	);
}
```

**Ключові моменти:**
- ✅ Zod схема з кастомними повідомленнями
- ✅ `z.infer` для автоматичної типізації
- ✅ zodResolver для інтеграції з RHF
- ✅ Відображення помилок валідації
- ✅ Disable кнопки під час submit

---

### 4. Login Form з Auth

**Файл:** `src/features/auth/api.ts`

```typescript
import { useMutation } from "@tanstack/react-query";
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

interface LoginResponse {
	token: string;
	user?: {
		id: number;
		email: string;
	};
}

// API функція
const login = async (data: LoginDto): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>("/auth/login", data);
	return response.data;
};

// React Query Hook
export const useLogin = () => {
	const navigate = useNavigate();
	const setToken = useAuthStore((state) => state.setToken);

	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			setToken(data.token); // Зберігаємо в Zustand
			void navigate({ to: "/" });
		},
		onError: (error: Error) => {
			console.error("Login failed:", error);
			alert("Невірний email або пароль");
		},
	});
};
```

**Zustand Store:** `src/store/authStore.ts`

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
	token: string | null;
	isAuthenticated: boolean;
	setToken: (token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			token: null,
			isAuthenticated: false,
			setToken: (token) => set({ token, isAuthenticated: true }),
			logout: () => set({ token: null, isAuthenticated: false }),
		}),
		{
			name: "auth-storage", // ключ в localStorage
		}
	)
);
```

**Ключові моменти:**
- ✅ Zustand з persist middleware для localStorage
- ✅ Login mutation з обробкою success/error
- ✅ Автоматична навігація після успіху
- ✅ Токен доступний в Axios interceptor

---

### 5. TanStack Router File-based Routing

**Файл:** `src/routes/books.tsx` (список книг)

```typescript
import { createFileRoute, Link } from "@tanstack/react-router";
import { useBooks, useDeleteBook } from "@/features/books/booksApi";

function BooksPage() {
	const { data: books, isLoading, isError } = useBooks();
	const deleteBookMutation = useDeleteBook();

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading books</div>;

	return (
		<div>
			<h1>Книги</h1>
			{books?.map((book) => (
				<div key={book.id}>
					<h3>{book.bookTitle}</h3>
					<Link to="/books/$bookId" params={{ bookId: String(book.id) }}>
						Редагувати
					</Link>
					<button onClick={() => deleteBookMutation.mutate(String(book.id))}>
						Видалити
					</button>
				</div>
			))}
		</div>
	);
}

export const Route = createFileRoute("/books")({
	component: BooksPage,
});
```

**Файл:** `src/routes/books.$bookId.tsx` (редагування)

```typescript
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useBook, useUpdateBook } from "@/features/books/booksApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function EditBookPage() {
	const { bookId } = useParams({ from: "/books/$bookId" });
	const { data: book, isLoading } = useBook(bookId);
	const updateMutation = useUpdateBook();
	const { register, handleSubmit, reset } = useForm();

	// Заповнюємо форму при завантаженні даних
	useEffect(() => {
		if (book) {
			reset({
				title: book.bookTitle,
				publisher: book.publisher,
				year: book.year,
			});
		}
	}, [book, reset]);

	const onSubmit = (data) => {
		updateMutation.mutate({ id: bookId, data });
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input {...register("title")} />
			<button type="submit">Зберегти</button>
		</form>
	);
}

export const Route = createFileRoute("/books/$bookId")({
	component: EditBookPage,
});
```

**Ключові моменти:**
- ✅ `createFileRoute()` для типобезпечного роутингу
- ✅ `useParams()` для отримання параметрів з типами
- ✅ Динамічні сегменти: `$bookId`
- ✅ `reset()` для заповнення форми при edit

---

## Скріншоти

### 1. Головна сторінка
![Головна сторінка](./screenshots/home.png)
*Дашборд зі статистикою бібліотеки та швидким доступом до основних функцій*

**Що показати на скріншоті:**
- Статистика (всього книг, нові надходження, видачі)
- Hero секція з навігацією
- Responsive дизайн

---

### 2. Список книг з пошуком
![Список книг](./screenshots/books-list.png)
*Каталог книг з можливістю пошуку, фільтрації та CRUD операціями*

**Що показати на скріншоті:**
- Список книг з інформацією
- Поле пошуку
- Кнопки "Редагувати" та "Видалити"
- Loading стан (опціонально)

---

### 3. Форма створення книги
![Форма створення](./screenshots/create-book.png)
*Форма з валідацією на стороні клієнта через React Hook Form + Zod*

**Що показати на скріншоті:**
- Всі поля форми
- Responsive дизайн
- Кнопки "Створити" та "Скасувати"

---

### 4. Валідація форми
![Валідація](./screenshots/form-validation.png)
*Валідаційні помилки відображаються в реальному часі*

**Що показати на скріншоті:**
- Червоні повідомлення про помилки під полями
- Виділені червоним border поля з помилками
- Різні типи валідації (required, min length, email format)

---

### 5. Форма редагування
![Редагування книги](./screenshots/edit-book.png)
*Форма редагування з попередньо заповненими даними та історією видач*

**Що показати на скріншоті:**
- Форма з даними існуючої книги
- Секція "Loan History" (якщо є)
- Кнопки "Зберегти зміни" та "Скасувати"

---

### 6. Network Tab (API запити)
![Network Tab](./screenshots/network-requests.png)
*Chrome DevTools Network Tab з успішними API запитами*

**Що показати на скріншоті:**
- GET /books (отримання списку)
- POST /books (створення книги)
- PUT /books/:id (оновлення)
- DELETE /books/:id (видалення)
- Authorization header з Bearer token
- Status codes (200, 201, 204)

---

### 7. TanStack Query Devtools
![React Query Devtools](./screenshots/react-query-devtools.png)
*TanStack Query Devtools показує кешовані запити та їх стани*

**Що показати на скріншоті:**
- Query keys: ["books"], ["books", "1"]
- Стани: fresh, stale, fetching
- Cached data
- Query status та timestamps

---

### 8. Login форма
![Login](./screenshots/login.png)
*Форма авторизації з валідацією*

**Що показати на скріншоті:**
- Email та password поля
- Валідаційні помилки
- Loading стан кнопки
- Дизайн форми

---

### 9. Mobile Responsive
![Mobile View](./screenshots/mobile-responsive.png)
*Адаптивний дизайн для мобільних пристроїв*

**Що показати на скріншоті:**
- Список книг на мобільному
- Форма на мобільному
- Navigation menu

---

## Складнощі та їх вирішення

### 1. Невідповідність типів між формою та API

**Проблема:**
API очікує поле `bookTitle`, а форма використовує `title`.

**Рішення:**
Створив mapping функцію в `onSubmit`:

```typescript
const onSubmit = (data: CreateBookForm): void => {
	const payload: CreateBookDto = {
		bookTitle: data.title, // mapping
		author: data.author,
		isbn: data.isbn,
		year: Number(data.year),
		// ...
	};
	createMutation.mutate(payload);
};
```

---

### 2. Reset форми при редагуванні

**Проблема:**
Форма не заповнювалась даними при відкритті сторінки редагування.

**Рішення:**
Використав `useEffect` + `reset()`:

```typescript
useEffect(() => {
	if (book) {
		reset({
			title: book.bookTitle,
			publisher: book.publisher,
			year: book.year,
		});
	}
}, [book, reset]);
```

---

### 3. Автоматичне оновлення списку після створення

**Проблема:**
Після створення книги список не оновлювався автоматично.

**Рішення:**
Використав `invalidateQueries` в TanStack Query:

```typescript
onSuccess: () => {
	void queryClient.invalidateQueries({ queryKey: ["books"] });
	void navigate({ to: "/books" });
},
```

---

### 4. Типізація Zod з React Hook Form

**Проблема:**
TypeScript помилки при інтеграції Zod resolver.

**Рішення:**
Використав `z.infer` для автоматичної генерації типів:

```typescript
const schema = z.object({ ... });
type FormData = z.infer<typeof schema>;

const { register } = useForm<FormData>({
	resolver: zodResolver(schema)
});
```

---

### 5. 401 Unauthorized помилки

**Проблема:**
При невалідному токені сторінки "падали" з помилками.

**Рішення:**
Додав response interceptor в Axios для автоматичного logout:

```typescript
if (error.response?.status === 401) {
	useAuthStore.getState().logout();
}
```

---

### 6. Проблеми з CORS

**Проблема:**
CORS помилки при запитах до backend API.

**Рішення:**
На backend додав CORS middleware:

```javascript
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));
```

---

## Висновки

### Що було реалізовано:

1. ✅ **Повний CRUD функціонал** для управління книгами
2. ✅ **Централізований API клієнт** на базі Axios з interceptors
3. ✅ **TanStack Query** для управління серверним станом без useEffect
4. ✅ **TanStack Router** з файловим роутингом та типобезпекою
5. ✅ **React Hook Form + Zod** для валідації форм
6. ✅ **JWT авторизація** через Zustand + localStorage
7. ✅ **Responsive UI** з Tailwind CSS
8. ✅ **TypeScript типізація** на всіх рівнях

### Набуті навички:

- Розуміння принципів роботи TanStack Query (cache, invalidation, optimistic updates)
- Професійна структура React проєкту (feature-based architecture)
- Інтеграція з REST API через Axios
- Валідація даних на стороні клієнта
- Типобезпечний роутинг з TanStack Router
- State management з Zustand

### Можливості для покращення:

- [ ] Додати pagination для списку книг
- [ ] Реалізувати toast notifications замість alert()
- [ ] Додати unit тести для компонентів
- [ ] Реалізувати оптимістичні оновлення для mutations
- [ ] Додати loading скелетони замість звичайних спінерів
- [ ] Реалізувати error boundary для глобальної обробки помилок

---

## Додаткова інформація

### Запуск backend сервера:

Проєкт очікує, що backend API працює на `http://localhost:4000/v1`

Переконайтесь, що backend запущений перед тестуванням frontend.

### Корисні команди:

```bash
# Запуск проєкту
pnpm run dev

# Відкриття TanStack Query Devtools
# Натисніть на іконку в лівому нижньому куті

# Відкриття TanStack Router Devtools
# Натисніть на іконку в правому нижньому куті

# Перевірка типів
pnpm run build

# Лінтинг
pnpm run lint
```

---

**Дата завершення:** 08.01.2026
**Статус:** ✅ Готово до здачі
