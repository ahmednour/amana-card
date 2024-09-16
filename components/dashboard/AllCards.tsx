"use client"

import { useEffect, useState } from 'react'
import { getCards } from "@/_utils/cardApis"
import Image from 'next/image';
import { Edit } from './Edit';
import { Confirm } from './Confirm';
import { Card } from '@/_utils/types';
import AddNew from "@/components/dashboard/AddNew"



const AllCards = () => {
    const [cards, setCards] = useState<Card[]>([])
   
    useEffect(() => {
        getCards().then((res) => {
            console.log(res.data)
            setCards(res.data)
        })
    },[]);
    
    return (
        <div className="container mx-auto">
            {/* Add New Card */}
            <AddNew setCards={setCards}/>       
            {cards.map((card: Card) => (
                <div key={card.id} className='w-full bg-white shadow rounded-lg flex flex-row items-center justify-between gap-4 mb-3 border-b-2 border-gray-300 py-3 px-5'>
                    <div className='text-gray-500 text-lg font-bold'>{card.id}</div>
                    <div className='h-10 w-10 mb-3'>
                        <Image src={`http://localhost:1337${card.attributes.cover.data.attributes.url}`} alt="" width={500} height={300} />
                    </div>
                    <p className='w-1/4 text-lg font-bold'>{card.attributes.title}</p>
                    <div className='w-1/4 flex space-x-2 items-center flex-col md:flex-row'>
                        <div className='flex -space-x-2 overflow-hidden p-2'>
                            {card.attributes.images.data.map((cardImage: { attributes: { url: string } }, index: number) => (
                                <Image key={index} src={`http://localhost:1337${cardImage.attributes.url}`} alt="" width={500} height={300} className='inline-block h-10 w-10 rounded-full ring-2 ring-gray-200 hover:scale-105 tranform duration-100 cursor-pointer' />
                            ))}
                        </div>
                    </div>
                    <p className='w-1/4 text-sm text-gray-500'>{card.attributes.titleSmall}</p>
                    <div className='flex flex-row gap-4'>
                        <Edit 
                            id={card.id} 
                            title={card.attributes.title} 
                            description={card.attributes.titleSmall} 
                            cover={card.attributes.cover.data.attributes.url} 
                            images={card.attributes.images.data} 
                        />
                        <Confirm id={card.id}  setCards={setCards}/>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AllCards