"use client";
import { useState, useEffect } from "react";
import Skeleton from "./components/Skeleton";
import Navbar from "./components/Navbar";
import Recent from "./components/Recent";

export default function Home() {
  const [holders, setHolders] = useState<
    Array<{ wallet: string; balance: number }>
  >([]);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  const handleSearch = (address: string) => {
    const addressExists = holders.some((holder) => holder.wallet === address);
    if (addressExists) {
      setSearchedAddress(address);
    }
  };

  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetch("/api/holders");
        const data = await response.json();
        const convertedData = data.map(
          (holder: { wallet: string; balance: bigint }) => ({
            wallet: holder.wallet,
            balance: Number(holder.balance) / 1e9,
          })
        );
        setHolders(convertedData);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }
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
    fetchHolders();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar onSearch={handleSearch} />
      <Skeleton
        holders={holders}
        searchedAddress={searchedAddress}
        supply={supply}
      />
      <Recent />
    </div>
  );
}
