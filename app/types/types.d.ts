export interface WeddingImage {
    ident: string;
    cloudflareLink: string;
    onedriveLink: string;
    categories: Array<WeddingCategory>;
}

export interface WeddingCategory {
    name: string;
}