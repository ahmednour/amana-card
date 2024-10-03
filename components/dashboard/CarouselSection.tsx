import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
interface Cards {
    id: number;
    attributes: {
        images: {
            url: string;
        }
    }
}
export function CarouselSection({ cardImages }: { cardImages: Cards }) {
    return (
        <Carousel className="w-full max-w-xs" style={{ direction: "ltr" }}>
            <CarouselContent>
                {cardImages.attributes.images.map((cardImage, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Image key={index} src={`http://localhost:1337${cardImage.url}`} alt="" width={500} height={300} />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
