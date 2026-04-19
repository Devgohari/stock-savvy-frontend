import api from "@/lib/axios";

export interface RegisterPayload {
  email: string;
  password: string;
  riskPercentage?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  telegramChatId: string | null;
  riskPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const register = async (payload: RegisterPayload): Promise<TokenResponse> => {
  const { data } = await api.post<TokenResponse>("/auth/register", payload);
  return data;
};

export const loginApi = async (payload: LoginPayload): Promise<TokenResponse> => {
  const { data } = await api.post<TokenResponse>("/auth/login", payload);
  return data;
};

export const getMe = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>("/users/me");
  return data;
};

export const updateMe = async (payload: {
  telegramChatId?: string;
  riskPercentage?: number;
}): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>("/users/me", payload);
  return data;
};
