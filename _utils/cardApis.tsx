import axiosClient from './axiosClient';

export const getCards = async () => {
    const response = await axiosClient.get("/api/cards?populate=*");
    return response.data;
};

export const getCardById = async (id:number) => {
    const response = await axiosClient.get(`/api/cards/${id}`);
    return response.data;
};

export const getCardBySlug = async (slug) => {
    const response = await axiosClient.get(`/api/cards?filters[slug][$eq]=${slug}`);
    return response.data;
};

export const createCard = async (data:number) => {
    const response = await axiosClient.post("/api/cards", data);
    return response.data;
};
export const updateCard = async (documentId, formData) => {
  try {
    const response = await axiosClient.put(`/api/cards/${documentId}`, formData);
    return response.data;
  } 
  catch (error) {
    console.error("Failed to update card:", error);
    throw error;
  }
};

export const deleteCard = async (documentId) => {
  const response = await axiosClient.delete(`/api/cards/${documentId}`);
    return response.data;
};

export const deleteImage = async (image) => {
    const response = await axiosClient.delete(`${image}`);
    return response.data;
};



