export type Holder = {
  wallet: string;
  balance: number;
};

export type HolderData = {
  wallet: string;
  position: {
    x: number;
    y: number;
    size: number;
    rotation: number | null;
    balance: number;
  };
};

export type OccupiedSpace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
