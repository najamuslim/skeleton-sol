"use client";
import { useState, useEffect } from "react";
import Flower from "./components/Skeleton";

export default function Home() {
  const [holders, setHolders] = useState<
    Array<{ wallet: string; balance: number }>
  >([]);

  useEffect(() => {
    async function fetchHolders() {
      try {
        const response = await fetch("/api/holders");
        console.log(response);
        const data = await response.json();
        console.log(data);
        setHolders(data);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }

    fetchHolders();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
      }}
    >
      {holders.map(({ wallet, balance }) => (
        <div key={wallet} style={{ textAlign: "center" }}>
          <Flower wallet={wallet} size={50 + Math.sqrt(balance) * 10} />
          <p>
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </p>
          <p>{balance.toFixed(2)} $FLOWER</p>
        </div>
      ))}
    </div>
  );
}
