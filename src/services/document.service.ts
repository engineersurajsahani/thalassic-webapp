import { api } from "@/lib/axios";

export const documentService = {
  async getDocuments() {
    const response = await api.get("/documents");
    return response.data;
  },

  async uploadDocument(
    type: string,
    file: File,
    expiryDate?: string,
    onUploadProgress?: (progressEvent: any) => void
  ) {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);
    if (expiryDate) {
      formData.append("expiryDate", expiryDate);
    }

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  async deleteDocument(id: string) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};
