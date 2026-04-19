import { useQuery } from "@tanstack/react-query";
import { getStocksBySector } from "@/api/sectors";

export const useStocks = (sector: string | null) =>
  useQuery({
    queryKey: ["stocks", sector],
    queryFn: () => getStocksBySector(sector!),
    enabled: !!sector,
    staleTime: 5 * 60 * 1000,
  });
