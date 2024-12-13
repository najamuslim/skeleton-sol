export interface ProcessedHolder {
  wallet: string;
  balance: number;
  position: {
    x: number;
    y: number;
    size: number;
    rotation: number;
  };
}
