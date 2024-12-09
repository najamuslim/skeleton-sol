
// Helper function to convert a hex string into a color
export const addressToColor = (address: string, startRange:number, endRange:number): string => {
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
export const addressToPosition = (address: string, scale: number, startRange:number, endRange:number):  number => {
    // Ensure the address is at least 16 characters long
    const paddedAddress = address.padEnd(16, '0');
    
    // Get the first 8 characters for x, and the next 8 characters for y
    const position = parseInt(paddedAddress.slice(startRange, endRange), 16) % scale; // Convert to integer and mod with scale\
    
    return position;
  };
  

// Helper function to convert the address into a size (e.g., within a certain range)
export const addressToSize = (address: string, minSize: number, maxSize: number): number => {
    const size = parseInt(address.slice(16, 24), 16) % (maxSize - minSize) + minSize;
    return size;
};