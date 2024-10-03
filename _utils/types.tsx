import { url } from "inspector"

interface ImageObject {
    url: string;
}
interface coverImage {
    url: string;
}
export interface Card {
    id: number;
    documentId: string;
    title: string;
    titleSmall: string;
    cover: coverImage;
    images: ImageObject[];
}