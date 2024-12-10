// Helper function to convert a hex string into a color
export const addressToColor = (
  address: string,
  startRange: number,
  endRange: number
): string => {
  // Slice the address and use part of it as the hex value
  const hex = address.slice(startRange, endRange); // Taking first 6 characters of address
  return `#${stringToHexColor(hex)}`;
};

export function stringToHexColor(str: string): string {
  let hash = 0;

  // Generate a hash from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to a hex color
  let color = "";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff; // Extract 8 bits
    color += value.toString(16).padStart(2, "0"); // Convert to hex and pad if necessary
  }

  return color;
}

// Helper function to convert a part of the address into a number for x and y
// utils/addressToPosition.ts
export function getGridPosition(
  address: string,
  gridSize: number,
  maxColumns: number
): { x: number; y: number } {
  // Gunakan 8 karakter pertama wallet address sebagai seed
  const seed = parseInt(address.slice(0, 8), 16);

  // Tentukan posisi berdasarkan seed
  const position = seed % (gridSize * gridSize);
  const column = position % maxColumns;
  const row = Math.floor(position / maxColumns);

  // Base size untuk spacing
  const baseSize = 100;

  return {
    x: column * baseSize,
    y: row * baseSize,
  };
}

export function addressToPosition(
  address: string,
  start: number,
  end: number,
  dimension: "width" | "height"
): number {
  const gridPos = getGridPosition(address, 50, 8); // 50 grid size, 8 columns
  return dimension === "width" ? gridPos.x : gridPos.y;
}

// Helper function to convert the address into a size (e.g., within a certain range)
export const addressToSize = (
  address: string,
  minSize: number,
  maxSize: number
): number => {
  const size =
    (parseInt(address.slice(16, 24), 16) % (maxSize - minSize)) + minSize;
  return size;
};
