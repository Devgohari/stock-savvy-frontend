export interface StockData {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  historicalData: { open: number; close: number; volume: number; change: number }[];
}

export const SECTORS = [
  "Banking", "Financial Services", "Information Technology", "Automobile",
  "Chemical", "Pharmaceuticals", "FMCG", "Energy", "Oil & Gas", "Telecom",
  "Infrastructure", "Real Estate", "Metals & Mining", "Power",
  "Consumer Durables", "Media & Entertainment", "Healthcare",
  "Capital Goods", "PSU", "Defence", "Renewable Energy",
] as const;

function generateHistorical(basePrice: number): StockData["historicalData"] {
  const data = [];
  let price = basePrice * (0.9 + Math.random() * 0.2);
  for (let i = 0; i < 10; i++) {
    const open = price;
    const changePct = (Math.random() - 0.45) * 4;
    const close = open * (1 + changePct / 100);
    const volume = Math.floor(500000 + Math.random() * 5000000);
    data.push({ open: +open.toFixed(2), close: +close.toFixed(2), volume, change: +changePct.toFixed(2) });
    price = close;
  }
  return data;
}

function makeStock(id: string, name: string, symbol: string, sector: string, basePrice: number): StockData {
  const hist = generateHistorical(basePrice);
  const previousClose = hist[hist.length - 1].close;
  const changePct = +(Math.random() * 6 - 2.5).toFixed(2);
  const currentPrice = +(previousClose * (1 + changePct / 100)).toFixed(2);
  const change = +(currentPrice - previousClose).toFixed(2);
  return { id, name, symbol, sector, currentPrice, previousClose, change, changePercent: changePct, volume: Math.floor(500000 + Math.random() * 8000000), historicalData: hist };
}

export const ALL_STOCKS: StockData[] = [
  // Banking
  makeStock("1", "HDFC Bank", "HDFCBANK", "Banking", 1650),
  makeStock("2", "ICICI Bank", "ICICIBANK", "Banking", 1050),
  makeStock("3", "State Bank of India", "SBIN", "Banking", 620),
  makeStock("4", "Kotak Mahindra Bank", "KOTAKBANK", "Banking", 1780),
  makeStock("5", "Axis Bank", "AXISBANK", "Banking", 1100),
  // Financial Services
  makeStock("6", "Bajaj Finance", "BAJFINANCE", "Financial Services", 7200),
  makeStock("7", "Bajaj Finserv", "BAJAJFINSV", "Financial Services", 1600),
  makeStock("8", "HDFC Life", "HDFCLIFE", "Financial Services", 650),
  // Information Technology
  makeStock("9", "TCS", "TCS", "Information Technology", 3800),
  makeStock("10", "Infosys", "INFY", "Information Technology", 1500),
  makeStock("11", "Wipro", "WIPRO", "Information Technology", 450),
  makeStock("12", "HCL Technologies", "HCLTECH", "Information Technology", 1350),
  // Automobile
  makeStock("13", "Maruti Suzuki", "MARUTI", "Automobile", 10500),
  makeStock("14", "Tata Motors", "TATAMOTORS", "Automobile", 650),
  makeStock("15", "Mahindra & Mahindra", "M&M", "Automobile", 1550),
  // Chemical
  makeStock("16", "SRF Limited", "SRF", "Chemical", 2400),
  makeStock("17", "Pidilite Industries", "PIDILITIND", "Chemical", 2700),
  // Pharmaceuticals
  makeStock("18", "Sun Pharma", "SUNPHARMA", "Pharmaceuticals", 1150),
  makeStock("19", "Dr. Reddy's", "DRREDDY", "Pharmaceuticals", 5500),
  makeStock("20", "Cipla", "CIPLA", "Pharmaceuticals", 1200),
  // FMCG
  makeStock("21", "Hindustan Unilever", "HINDUNILVR", "FMCG", 2500),
  makeStock("22", "ITC", "ITC", "FMCG", 440),
  makeStock("23", "Nestle India", "NESTLEIND", "FMCG", 22000),
  // Energy
  makeStock("24", "Reliance Industries", "RELIANCE", "Energy", 2450),
  makeStock("25", "Adani Green Energy", "ADANIGREEN", "Energy", 1200),
  // Oil & Gas
  makeStock("26", "ONGC", "ONGC", "Oil & Gas", 190),
  makeStock("27", "Indian Oil Corp", "IOC", "Oil & Gas", 95),
  makeStock("28", "BPCL", "BPCL", "Oil & Gas", 380),
  // Telecom
  makeStock("29", "Bharti Airtel", "BHARTIARTL", "Telecom", 900),
  makeStock("30", "Jio Financial", "JIOFIN", "Telecom", 250),
  // Infrastructure
  makeStock("31", "Larsen & Toubro", "LT", "Infrastructure", 3200),
  makeStock("32", "Adani Ports", "ADANIPORTS", "Infrastructure", 850),
  // Real Estate
  makeStock("33", "DLF", "DLF", "Real Estate", 550),
  makeStock("34", "Godrej Properties", "GODREJPROP", "Real Estate", 1800),
  // Metals & Mining
  makeStock("35", "Tata Steel", "TATASTEEL", "Metals & Mining", 130),
  makeStock("36", "Hindalco", "HINDALCO", "Metals & Mining", 480),
  makeStock("37", "JSW Steel", "JSWSTEEL", "Metals & Mining", 800),
  // Power
  makeStock("38", "NTPC", "NTPC", "Power", 250),
  makeStock("39", "Power Grid Corp", "POWERGRID", "Power", 280),
  // Consumer Durables
  makeStock("40", "Titan Company", "TITAN", "Consumer Durables", 3200),
  makeStock("41", "Havells India", "HAVELLS", "Consumer Durables", 1400),
  // Media & Entertainment
  makeStock("42", "Zee Entertainment", "ZEEL", "Media & Entertainment", 145),
  makeStock("43", "PVR INOX", "PVRINOX", "Media & Entertainment", 1500),
  // Healthcare
  makeStock("44", "Apollo Hospitals", "APOLLOHOSP", "Healthcare", 5800),
  makeStock("45", "Max Healthcare", "MAXHEALTH", "Healthcare", 700),
  // Capital Goods
  makeStock("46", "Siemens India", "SIEMENS", "Capital Goods", 4200),
  makeStock("47", "ABB India", "ABB", "Capital Goods", 4800),
  // PSU
  makeStock("48", "Coal India", "COALINDIA", "PSU", 250),
  makeStock("49", "BHEL", "BHEL", "PSU", 130),
  // Defence
  makeStock("50", "HAL", "HAL", "Defence", 3500),
  makeStock("51", "Bharat Electronics", "BEL", "Defence", 130),
  makeStock("52", "Bharat Dynamics", "BDL", "Defence", 1100),
  // Renewable Energy
  makeStock("53", "Tata Power", "TATAPOWER", "Renewable Energy", 260),
  makeStock("54", "Suzlon Energy", "SUZLON", "Renewable Energy", 35),
];

export function getStocksBySectors(sectors: string[]): StockData[] {
  return ALL_STOCKS.filter(s => sectors.includes(s.sector));
}
