import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoPencil } from "react-icons/go";
import { updateCard, getCards } from "@/_utils/cardApis";
import { useRouter } from "next/navigation";
import { Card } from "@/_utils/types";
import Image from "next/image";
export function Edit({
    id,
    title,
    titleSmall,
    cover,
    images,
    setCards
}: {
    id: number;
    title: string;
    titleSmall: string;
    cover: string;
    images: string[];
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}) {
    const router = useRouter();
    const [newCard, setNewCard] = useState({
        id,
        title,
        titleSmall,
        cover: cover || null,
        images: images || []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [newCover, setNewCover] = useState<File | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCard(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveImage = useCallback((index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewCard(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    }, []);

    const handleRemoveCover = useCallback(() => {
        setNewCard(prev => ({ ...prev, cover: null }));
        setNewCover(null);
    }, []);

    const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewCover(file);
            setNewCard(prev => ({ ...prev, cover: URL.createObjectURL(file) }));
        }
    }, []);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImages(prev => {
                const newArray = [...prev];
                newArray[index] = file;
                return newArray;
            });
            setNewCard(prev => ({
                ...prev,
                images: prev.images.map((img, i) => i === index ? URL.createObjectURL(file) : img)
            }));
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('data', JSON.stringify({
                id: newCard.id,
                title: newCard.title,
                titleSmall: newCard.titleSmall,
                cover: newCover ? undefined : newCard.cover ,
                images: newCard.images
            }));

            if (newCover) {
                formDataToSend.append('files.cover', newCover);
            } 

            newImages.forEach((image, index) => {
                if (image) {
                    formDataToSend.append(`files.images`, image, `image_${index}`);
                }
            });
           
            try {
                await updateCard(newCard.id, formDataToSend);
            } catch (error) {
                console.error('Error updating card:', error);
                if (error instanceof Error && 'response' in error) {
                    const axiosError = error as any;
                    console.error('Response data:', axiosError.response?.data);
                    console.error('Response status:', axiosError.response?.status);
                    console.error('Response headers:', axiosError.response?.headers);
                }
                throw error; // Re-throw the error to be caught by the outer try-catch
            }
            setIsOpen(false);
            const response = await getCards();
            setCards(response.data);
            router.refresh();
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setIsLoading(false);
        }
    }, [newCard, newImages, newCover, router, setCards]);

    const getImageSrc = useCallback((image: string | File) => {
        if (typeof image === 'string') {
            return image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_PATH_URL}${image}`;
        }
        return URL.createObjectURL(image);
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="text-gray-500" aria-label="Edit">
                    <GoPencil size={20} />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-right">تعديل المناسبة</DialogTitle>
                    <DialogDescription className="text-right">
                        يمكنك تعديل المناسبة بالضغط على الحقل المطلوب , ثم الضغط على حفظ التعديلات
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            اسم المناسبة
                        </Label>
                        <Input
                            id="title"
                            value={newCard.title}
                            className="col-span-3"
                            name="title"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="titleSmall" className="text-right">
                            وصف المناسبة
                        </Label>
                        <Input
                            id="titleSmall"
                            value={newCard.titleSmall}
                            className="col-span-3"
                            name="titleSmall"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cover" className="text-right">
                            الصورةالرئيسية
                        </Label>
                        {(newCard.cover || newCover) && (
                            <div className="col-span-3 relative group mb-4">
                                <Image
                                    src={getImageSrc(newCover || newCard.cover || '')}
                                    alt="cover"
                                    width={500}
                                    height={300}
                                    className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg">
                                    <button className="text-white bg-red-500 px-2 py-1 rounded-md text-sm mr-2" onClick={handleRemoveCover}>حذف</button>
                                    <label htmlFor="cover" className="text-white bg-black px-2 py-1 rounded-md text-sm cursor-pointer">
                                        تغيير
                                    </label>
                                </div>
                            </div>
                        )}
                        <div className="col-span-3">
                            {!newCard.cover && !newCover && (
                                <label htmlFor="cover" className="cursor-pointer flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-300">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-600">Click to upload or drag and drop</p>
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </label>
                            )}
                            <Input
                                id="cover"
                                className="hidden"
                                name="cover"
                                onChange={handleCoverChange}
                                type="file"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="images" className="text-right text-lg font-bold mb-2 block w-full">
                            صور المناسبة
                        </Label>
                        {newCard.images.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                                {newCard.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <Image
                                            src={getImageSrc(newImages[index] || image)}
                                            alt={`Image ${index + 1}`}
                                            width={500}
                                            height={300}
                                            className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg">
                                            <button className="text-white bg-red-500 px-2 py-1 rounded-md text-sm mr-2" onClick={() => handleRemoveImage(index)}>حذف</button>
                                            <label htmlFor={`image-upload-${index}`} className="text-white bg-black px-2 py-1 rounded-md text-sm cursor-pointer">
                                                تغيير
                                            </label>
                                            <input
                                                id={`image-upload-${index}`}
                                                type="file"
                                                name="images"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(e, index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center">
                                    <label htmlFor="add-new-image" className="cursor-pointer flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-300">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        <span className="mt-2 text-sm text-gray-500">إضافة صورة جديدة</span>
                                    </label>
                                    <input
                                        id="add-new-image"
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setNewImages(prev => [...prev, file]);
                                                setNewCard(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, `/temp-image-${file.name}`]
                                                }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-between gap-4">
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>الغاء</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
