import axiosClient from './axiosClient';

export const getCards = async () => {
    const response = await axiosClient.get("/api/cards?populate=*");
    return response.data;
};

export const getCardById = async (id) => {
    const response = await axiosClient.get(`/api/cards/${id}`);
    return response.data;
};

export const getCardBySlug = async (slug) => {
    const response = await axiosClient.get(`/api/cards?filters[slug][$eq]=${slug}`);
    return response.data;
};

export const createCard = async (data) => {
    const response = await axiosClient.post("/api/cards", data);
    return response.data;
};
export const updateCard = async (id, data) => {
    const response = await axiosClient.put(`/api/cards/${id}?populate=*`, data);
    return response.data;
};

export const deleteCard = async (id) => {
    const response = await axiosClient.delete(`/api/cards/${id}`);
    return response.data;
};

export const deleteImage = async (image) => {
    const response = await axiosClient.delete(`${image}`);
    return response.data;
};



