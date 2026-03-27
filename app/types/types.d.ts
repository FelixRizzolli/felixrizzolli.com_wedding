export interface WeddingImage {
    id: string;
    ident: string;
    cloudflareLink: string;
    onedriveLink: string;
    categories: Array<WeddingCategory>;
}

export interface WeddingCategory {
    id: string;
    name: string;
    categoryGroup: WeddingCategoryGroup;
}

export interface WeddingCategoryGroup {
    id: string;
    name: string;
}