"use client"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import Success from "./Success"
import Error from "./Error"
import { createCard, getCards } from "@/_utils/cardApis"
import { useRouter } from 'next/navigation';


export default function AddNew({setCards}: {setCards: (cards: Card[]) => void}) {
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        title: '',
        titleSmall: '',
        cover: null as File | null,
        images: [] as File[]
    });
   const router = useRouter();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'cover' && files) {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0]
            }));
        } else if (name === 'images' && files) {
            setFormData(prevState => ({
                ...prevState,
                [name]: Array.from(files)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setStatus('idle');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('data', JSON.stringify({
                title: formData.title,
                titleSmall: formData.titleSmall,
            }));
            if (formData.cover) {
                formDataToSend.append('files.cover', formData.cover);
            }
            formData.images.forEach((image) => {
                formDataToSend.append(`files.images`, image);
            });
            await createCard(formDataToSend);
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
            }, 5000);
            setIsVisible(false);
            setFormData({
                title: '',
                titleSmall: '',
                cover: null,
                images: []
            });  
            const response = await getCards();
            setCards(response.data);
            router.refresh();

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }, [formData, router, setCards]); // Remove setCards, add formData

    return (
        <div className="flex flex-col w-full items-center border-b-2 border-gray-200 pb-2 mb-2">
            <div className="flex justify-between w-full items-center">
                <h1 className="text-2xl font-bold">جميع المناسبات</h1>
                <Button onClick={() => setIsVisible(!isVisible)}>أضف مناسبة</Button>
            </div>
            {isVisible && (
                <form className="w-full mt-2" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل عنوان المناسبة"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            id="titleSmall"
                            name="titleSmall"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل تفاصيل المناسبه صغيره"
                            value={formData.titleSmall}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="file"
                            id="cover"
                            name="cover"
                            className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل صوره للمناسبة"
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="file"
                            id="images"
                            name="images"
                            className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل صور للمناسبة"
                            onChange={handleInputChange}
                            multiple
                            required
                        />
                    </div>
                    <Button type="submit" className="mt-2 bg-green-500 text-white float-end">أضف</Button>
                </form>
            )}
            {status === 'success' && <Success />}
            {status === 'error' && <Error />}
        </div>
    )
}
