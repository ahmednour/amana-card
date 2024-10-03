import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoPencil } from "react-icons/go";
import { updateCard } from "@/_utils/cardApis";
import { Card } from "@/_utils/types";
import Image from "next/image";

interface EditProps extends Omit<Card, 'images'> {
    onUpdate: () => void;
    images: Array<{ url: string }>;
}

export function Edit({ id, documentId, title, titleSmall, cover, images, onUpdate }: EditProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cardData, setCardData] = useState<Omit<Card, 'documentId'>>({
        id,
        title,
        titleSmall,
        cover,
        images: images || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCardData({ id, title, titleSmall, cover, images });
    }, [id, title, titleSmall, cover, images]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'images', index?: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCardData(prev => {
                        if (type === 'cover') {
                            return { ...prev, cover: { url: event.target?.result as string } };
                        } else if (type === 'images' && typeof index === 'number') {
                            const newImages = [...prev.images];
                            newImages[index] = { url: event.target?.result as string };
                            return { ...prev, images: newImages };
                        } else if (type === 'images') {
                            return { ...prev, images: [...prev.images, { url: event.target?.result as string }] };
                        }
                        return prev;
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setCardData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);
        try {
            // Prepare the data for the API
            const formData = new FormData();
            formData.append('data', JSON.stringify({
                title: cardData.title,
                titleSmall: cardData.titleSmall,
                cover: cardData.cover.url,
                images: cardData.images.map(image => image.url)
            }));

            // Handle cover image
            if (cardData.cover && cardData.cover.url.startsWith('data:')) {
                const coverBlob = await fetch(cardData.cover.url).then(r => r.blob());
                formData.append('files.cover', coverBlob, 'cover.jpg');
            }

            // Handle images
            cardData.images.forEach(async(image, index) => {
                if (image.url.startsWith('data:')) {
                    const imageBlob = await fetch(image.url).then(r => r.blob());
                    formData.append(`files.images.${index}`, imageBlob, `image${index}.jpg`);
                }
            });

            // Log the form data to see what is being sent
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const updatedCard = await updateCard(documentId, formData);
            console.log('Updated card:', updatedCard);
            setIsOpen(false);
            onUpdate();
        } catch (error) {
            console.error("Failed to update card:", error);
            setError("Failed to update card. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [documentId, cardData, onUpdate]);
    
    const validateForm = () => {
        if (!cardData.title) {
            setError("Title is required.");
            return false;
        }
        if (!cardData.titleSmall) {
            setError("Small title is required.");
            return false;
        }
        return true;
    };

    const renderImageUpload = useCallback((type: 'cover' | 'images', image?: { url: string }, index?: number) => (
        <div className="relative group mb-4">
            {image && (
                <Image
                    src={image.url.startsWith('data:') ? image.url : `http://localhost:1337${image.url}`}
                    alt={type === 'cover' ? "cover" : `Image ${index! + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-40 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-lg">
                {image && (
                    <button
                        type="button"
                        className="text-white bg-red-500 px-2 py-1 rounded-md text-sm mr-2"
                        onClick={() => type === 'cover' ? setCardData(prev => ({ ...prev, cover: { url: '' } })) : handleRemoveImage(index!)}
                    >
                        حذف
                    </button>
                )}
                <label
                    htmlFor={`${type}-${index ?? 'upload'}`}
                    className="text-white bg-black px-2 py-1 rounded-md text-sm cursor-pointer"
                >
                    {image ? 'تغيير' : 'إضافة'}
                </label>
            </div>
            <input
                id={`${type}-${index ?? 'upload'}`}
                type="file"
                name={type}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, type, index)}
            />
        </div>
    ), [handleFileChange, handleRemoveImage]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button type="button" className="text-gray-500" aria-label="Edit">
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
                            value={cardData.title}
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
                            value={cardData.titleSmall}
                            className="col-span-3"
                            name="titleSmall"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cover" className="text-right">
                            الصورةالرئيسية
                        </Label>
                        <div className="col-span-3">
                            {renderImageUpload('cover', cardData.cover)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="images" className="text-right text-lg font-bold mb-2 block w-full">
                            صور المناسبة
                        </Label>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                            {cardData.images.map((image, index) => (
                                <React.Fragment key={index}>
                                    {renderImageUpload('images', image, index)}
                                </React.Fragment>
                            ))}
                            {renderImageUpload('images')}
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-between gap-4">
                    <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        الغاء
                    </Button>
                </DialogFooter>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </DialogContent>
        </Dialog>
    );
}