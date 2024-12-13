/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Skeleton from "./components/Skeleton";
import Navbar from "./components/Navbar";
import Recent from "./components/Recent";
//import { ProcessedHolder } from "./types/holders";
import precomputedPositions from "./data/precomputedPositions.json";
export default function Home() {
  // const [holders] = useState<ProcessedHolder[]>(
  //   Object.values(precomputedPositions).map((item: any) => ({
  //     ...item,
  //     balance: Number(item.balance) / 1e9,
  //   }))
  // );
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  const handleSearch = (address: string) => {
    const addressExists = holders.some((holder) => holder.wallet === address);
    if (addressExists) {
      setSearchedAddress(address);
    }
  };

  useEffect(() => {
    // async function fetchHolders() {
    //   try {
    //     const response = await fetch("/api/holders");
    //     const data = await response.json();
    //     const convertedData: ProcessedHolder[] = data.map(
    //       (holder: ProcessedHolder) => ({
    //         ...holder,
    //         balance: Number(holder.balance) / 1e9,
    //       })
    //     );
    //     setHolders(convertedData);
    //   } catch (error) {
    //     console.error("Failed to fetch holders:", error);
    //   }
    // }
    const fetchSupply = async () => {
      try {
        const supply = await fetch("/api/token");
        const data = await supply.json();
        setSupply(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSupply();
    // fetchHolders();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onSearch={handleSearch} />
      {Object.entries(precomputedPositions).length > 0 && (
        <Skeleton
          holders={precomputedPositions}
          searchedAddress={searchedAddress}
          supply={supply}
        />
      )}
      <Recent />
    </div>
  );
}
