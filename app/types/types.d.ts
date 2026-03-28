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
    categoryGroup: WeddingCategoryGroup;
}

export interface WeddingCategoryGroup {
    id: string;
    name: string;
}

export interface GallerySort {
    field: 'ident' | 'createdAt';
    direction: 'asc' | 'desc';
}
