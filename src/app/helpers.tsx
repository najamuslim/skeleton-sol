
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
export const addressToPosition = (address: string, scale: number): { x: number, y: number } => {
    const x = parseInt(address.slice(0, 8), 16) % scale; // Get the first 8 characters and convert to integer
    const y = parseInt(address.slice(8, 16), 16) % scale; // Get the next 8 characters and convert to integer
    console.log(x)
    console.log(y)
    return { x, y };
};

// Helper function to convert the address into a size (e.g., within a certain range)
export const addressToSize = (address: string, minSize: number, maxSize: number): number => {
    const size = parseInt(address.slice(16, 24), 16) % (maxSize - minSize) + minSize;
    return size;
};