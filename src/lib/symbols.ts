export type SymbolKind = 'index' | 'equity'

export type SectorId =
  | 'tech'
  | 'health'
  | 'energy'
  | 'fin'
  | 'staples'
  | 'comm'

export interface MarketSymbol {
  id: string
  ticker: string
  name: string
  kind: SymbolKind
  sector?: SectorId
  basePrice: number
}

export const SECTOR_LABELS: Record<SectorId, string> = {
  tech: 'Tech',
  health: 'Health',
  energy: 'Energy',
  fin: 'Fin',
  staples: 'Staples',
  comm: 'Comm',
}

export const INDICES: MarketSymbol[] = [
  { id: 'SPX', ticker: 'SPX', name: 'S&P 500', kind: 'index', basePrice: 5842.11 },
  { id: 'NDX', ticker: 'NDX', name: 'Nasdaq 100', kind: 'index', basePrice: 20104.4 },
  { id: 'DJI', ticker: 'DJI', name: 'Dow Jones', kind: 'index', basePrice: 42156 },
  { id: 'RUT', ticker: 'RUT', name: 'Russell 2000', kind: 'index', basePrice: 2214.8 },
]

export const EQUITIES: MarketSymbol[] = [
  { id: 'NVDA', ticker: 'NVDA', name: 'NVIDIA Corp', kind: 'equity', sector: 'tech', basePrice: 142.18 },
  { id: 'AAPL', ticker: 'AAPL', name: 'Apple Inc', kind: 'equity', sector: 'tech', basePrice: 218.42 },
  { id: 'MSFT', ticker: 'MSFT', name: 'Microsoft Corp', kind: 'equity', sector: 'tech', basePrice: 428.1 },
  { id: 'AMZN', ticker: 'AMZN', name: 'Amazon.com', kind: 'equity', sector: 'comm', basePrice: 186.55 },
  { id: 'META', ticker: 'META', name: 'Meta Platforms', kind: 'equity', sector: 'comm', basePrice: 512.3 },
  { id: 'GOOGL', ticker: 'GOOGL', name: 'Alphabet Inc', kind: 'equity', sector: 'comm', basePrice: 174.2 },
  { id: 'TSLA', ticker: 'TSLA', name: 'Tesla Inc', kind: 'equity', sector: 'tech', basePrice: 248.5 },
  { id: 'JPM', ticker: 'JPM', name: 'JPMorgan Chase', kind: 'equity', sector: 'fin', basePrice: 248.9 },
  { id: 'XOM', ticker: 'XOM', name: 'Exxon Mobil', kind: 'equity', sector: 'energy', basePrice: 112.4 },
  { id: 'UNH', ticker: 'UNH', name: 'UnitedHealth', kind: 'equity', sector: 'health', basePrice: 562.15 },
  { id: 'PG', ticker: 'PG', name: 'Procter & Gamble', kind: 'equity', sector: 'staples', basePrice: 168.3 },
  { id: 'JNJ', ticker: 'JNJ', name: 'Johnson & Johnson', kind: 'equity', sector: 'health', basePrice: 156.75 },
]

export const ALL_SYMBOLS: MarketSymbol[] = [...INDICES, ...EQUITIES]

export const DEFAULT_SELECTED = 'AAPL'
