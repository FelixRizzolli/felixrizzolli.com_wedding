export interface WeddingImage {
    id: string;
    ident: string;
    cdnLink: string;
    onedriveLink: string;
    categories: Array<WeddingCategory>;
    createdAt?: string;
}

export interface WeddingCategory {
    id: string;
    name: string;
    type?: 'images' | 'people' | string;
    categoryGroup?: WeddingCategoryGroup | null;
}

export interface WeddingCategoryGroup {
    id: string;
    name: string;
}

export interface WeddingUser {
    id: string;
    username: string;
    categories?: Array<{
        id: string;
    }>;
}

export interface GallerySort {
    field: 'ident' | 'createdAt';
    direction: 'asc' | 'desc';
}
