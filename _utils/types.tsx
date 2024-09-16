export interface Card {
    id: number
    attributes: {
        titleSmall: string
        title: string
        images: {
            data: {
                attributes: {
                    url: string
                }
            }
        }
        cover: {
            data: {
                attributes: {
                    url: string
                }
            }
        }
    }

}