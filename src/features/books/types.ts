export enum LanguageEnum {
	UKRAINIAN = "Українська",
	ENGLISH = "Англійська",
	GERMAN = "Німецька",
	FRENCH = "Французька",
	SPANISH = "Іспанська",
	ROMANIAN = "Румунська",
	SLOVAK = "Словацька",
}

export enum BookStatus {
	NEW = "New",
	GOOD = "Good",
	DAMAGED = "Damaged",
	LOST = "Lost",
}

export interface Loan {
	id: number;
	issueDate: string;
	dueDate: string;
	isReturned: boolean;
	returnDate: string | null;
	userId: number;
	bookId: number;
}

export interface Book {
	id: number;
	bookTitle: string;

	author?: string;
	isbn?: string;

	publisher?: string;
	year: number;
	status?: string;

	totalCopies?: number;
	language?: string;
	location?: string;
	description?: string;
	category?: {
		id: string;
		name: string;
	};
}

export interface CreateBookDto {
	bookTitle: string;
	author: string;
	publisher: string;
	year: number;
	isbn: string;
	totalCopies: number;
	language: string;
	location: string;
	status: string;
	description?: string;
}

export type UpdateBookDto = Partial<CreateBookDto>;
