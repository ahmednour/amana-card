"use client";
import Link from 'next/link';

const cards = [
  {
    title: "شهر رمضان",
    description: "معايدة للعاملين في المؤسسة",
    images: [
      "/bg.jpg",
      "/bg2.jpg",
      "/bg3.jpg",
    ]
  },
  {
    title: "عيد الفطر والأضحى",
    description: "معايدة للعاملين في المؤسسة",
    images: [
      "/bg4.jpg",
      "/bg5.jpg",
    ]
  },
  {
    title: "اليوم الوطني",
    description: "معايدة للعاملين في المؤسسة",
    images: [
      "/bg4.jpg",
      "/bg5.jpg",
    ]
  },
  {
    title: "يوم التأسيس",
    description: "معايدة للعاملين في المؤسسة",
    images: [
      "/bg.jpg",
      "/bg2.jpg",
      "/bg3.jpg",
    ]
  },
]
export default function Home() {

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">كارت معايده </h1>
        <span>الرجاء إختيار المناسبة </span>
        <div className="grid gap-[1rem] p-[1rem] md:grid-cols-2 lg:grid-cols-4">
         {cards.map((card, index) => (
          <div key={index} className="card">
            <div className="content">
              <h2 className="title">{card.title}</h2>
              <p className="copy">{card.description}</p>
              <Link href={{ pathname: '/holiday', query: { title: card.title, bgImages: JSON.stringify(card.images) } }} className="btn">إنشاء كارت</Link>
            </div>
          </div>
         ))}
        </div>
      </div>
   </div>
  );
}
