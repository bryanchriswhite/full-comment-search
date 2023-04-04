export interface Comment {
    id: number;
    author: string;
    url: string;
    body: string;
    created_at: string;
    updated_at: string;
    body_tsv?: string; // Optional, as it is not always present in the database row
}
