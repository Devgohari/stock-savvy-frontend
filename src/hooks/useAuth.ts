import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginApi, register, getMe, type LoginPayload, type RegisterPayload } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { access_token } = await loginApi(payload);
      // Temporarily set token so getMe can attach it
      useAuthStore.setState({ token: access_token });
      const user = await getMe();
      return { token: access_token, user };
    },
    onSuccess: ({ token, user }) => {
      setAuth(
        {
          id: user.id,
          email: user.email,
          riskPercentage: user.riskPercentage,
          tradingMode: user.tradingMode,
          telegramChatId: user.telegramChatId,
        },
        token
      );
      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { access_token } = await register(payload);
      useAuthStore.setState({ token: access_token });
      const user = await getMe();
      return { token: access_token, user };
    },
    onSuccess: ({ token, user }) => {
      setAuth(
        {
          id: user.id,
          email: user.email,
          riskPercentage: user.riskPercentage,
          tradingMode: user.tradingMode,
          telegramChatId: user.telegramChatId,
        },
        token
      );
      navigate("/dashboard");
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  return () => {
    clearAuth();
    navigate("/login");
  };
};
