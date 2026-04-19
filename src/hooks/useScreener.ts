import { useMutation } from "@tanstack/react-query";
import { runScreener, type ScreenerRequest } from "@/api/screener";
import { useScreenerStore } from "@/store/screenerStore";

export const useScreener = () => {
  const setResults = useScreenerStore((s) => s.setScreenerResults);

  return useMutation({
    mutationFn: (req: ScreenerRequest) => runScreener(req),
    onSuccess: (data) => setResults(data),
  });
};
