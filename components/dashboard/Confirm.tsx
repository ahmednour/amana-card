"use client"
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { GoTrash } from "react-icons/go";
import { deleteCard, getCards } from "@/_utils/cardApis";
import { Card } from "@/_utils/types"; // Adjust the import path as needed

export function Confirm({ documentId, setCards }: { documentId: string, setCards: (cards: Card[]) => void}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const deleteHandle = useCallback(async () => {
        try {           
            await deleteCard(documentId);
            setOpen(false); 
            const response = await getCards();
            setCards(response.data);
            router.refresh();
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    }, [documentId, router, setCards]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
    }, []);

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <button className='text-gray-500' title="Delete card">
                    <GoTrash />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-500 text-right">هل أنت متأكد من حذف البطاقة؟</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 text-right">
                        عند حذف البطاقة ، سيتم حذفها بشكل دائم ولا يمكن استردادها.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center gap-4">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteHandle}>حذف</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
