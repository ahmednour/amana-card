"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCards } from '../_utils/cardApis';
interface Image {
  data: {
    id: number;
    attributes: {
      url: string;
    };
  };
}

interface Card {
  id: number;
  attributes: {
    title: string;
    titleSmall: string;
    images: {
      data: Image[];
    };   
  };
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const getAllCards = async () => {
    getCards().then((res) => {
      console.log(res.data);
      setCards(res.data);
    });
  }
  useEffect(() => {
    getAllCards();    
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">كارت معايده </h1>
        <span>الرجاء إختيار المناسبة </span>
        <div className="grid gap-[1rem] p-[1rem] md:grid-cols-2 lg:grid-cols-4">
         {cards.map((card, index) => (
          
          <div key={index} className="card">            
            <div className="content">
              <h2 className="title">{card.attributes.title}</h2>
               <p className="copy">{card.attributes.titleSmall}</p>
               <Link href={{ pathname: '/holiday', query: { title: card.attributes.title, bgImages: JSON.stringify(card.attributes.images.data) } }} className="btn">إنشاء كارت</Link>
            </div>
          </div>
         ))}
        </div>
      </div>
   </div>
  );
}
