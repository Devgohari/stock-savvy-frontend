import React, { createContext, useContext, useState, useCallback } from "react";
import { StockData } from "@/data/stocks";

interface WatchlistContextType {
  watchlist: StockData[];
  addToWatchlist: (stocks: StockData[]) => void;
  removeFromWatchlist: (stockId: string) => void;
  isInWatchlist: (stockId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<StockData[]>([]);

  const addToWatchlist = useCallback((stocks: StockData[]) => {
    setWatchlist(prev => {
      const ids = new Set(prev.map(s => s.id));
      const newStocks = stocks.filter(s => !ids.has(s.id));
      return [...prev, ...newStocks];
    });
  }, []);

  const removeFromWatchlist = useCallback((stockId: string) => {
    setWatchlist(prev => prev.filter(s => s.id !== stockId));
  }, []);

  const isInWatchlist = useCallback((stockId: string) => {
    return watchlist.some(s => s.id === stockId);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
