import { useQuery } from "@tanstack/react-query";
import { getSectors } from "@/api/sectors";

export const useSectors = () =>
  useQuery({
    queryKey: ["sectors"],
    queryFn: getSectors,
    staleTime: 10 * 60 * 1000,
  });
