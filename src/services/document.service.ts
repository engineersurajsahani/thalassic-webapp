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
    onUploadProgress?: (progressEvent: any) => void,
    metadata?: Record<string, any>
  ) {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);
    if (expiryDate) {
      formData.append("expiryDate", expiryDate);
    }
    if (metadata) {
      Object.entries(metadata).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });
    }

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  },

  async updateDocument(
    id: string,
    metadata: Record<string, any>,
    file?: File | null
  ) {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    Object.entries(metadata).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(key, String(val));
      }
    });

    const response = await api.put(`/documents/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteDocument(id: string) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  async downloadDocument(id: string) {
    const response = await api.get(`/documents/${id}/download`);
    return response.data;
  },
};
