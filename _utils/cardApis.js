import axiosClient from './axiosClient';

export const getCards = async () => {
    const response = await axiosClient.get("/cards?populate=*");
    return response.data;
};

export const getCardById = async (id) => {
    const response = await axiosClient.get(`/cards/${id}`);
    return response.data;
};

export const getCardBySlug = async (slug) => {
    const response = await axiosClient.get(`/cards?filters[slug][$eq]=${slug}`);
    return response.data;
};

export const createCard = async (data) => {
    const response = await axiosClient.post("/cards", data);
    return response.data;
};
export const updateCard = async (id, data) => {
    const response = await axiosClient.put(`/cards/${id}`, data);
    return response.data;
};

export const deleteCard = async (id) => {
    const response = await axiosClient.delete(`/cards/${id}`);
    return response.data;
};



