import { api } from "@/lib/axios";

export const referralService = {
  async getReferrals() {
    const response = await api.get("/referrals");
    return response.data;
  },
};
