"use client";
import { useState, useEffect } from "react";
import Skeleton from "./components/Skeleton";
import Navbar from "./components/Navbar";
import Recent from "./components/Recent";
// import { FpsView } from "react-fps";
import { useStore } from "@nanostores/react";
import {
  $holders,
  $holdersData,
  $holdersDataChunk,
  $maxY,
  $selectedHolder,
  $supply,
} from "./stores/holders";
import { Holder } from "@/types";
import Leaderboards from "./components/Leaderboard";

export default function Home() {
  // const [holders, setHolders] = useState<Array<Holder>>([]);
  // const holders = useStore($holders);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  // current chunk of holders data
  const data = useStore($holdersDataChunk);
  const maxY = useStore($maxY);

  const handleSearch = (address: string) => {
    const holder = $holdersData
      .get()
      .find((holder) => holder.wallet === address);

    if (holder) {
      setSearchedAddress(address);
      $selectedHolder.set(holder);
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
          }),
        );
        // setHolders(convertedData);
        $holders.set(convertedData);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }
    const fetchSupply = async () => {
      try {
        const supply = await fetch("/api/token");
        const data = await supply.json();
        setSupply(data);
        $supply.set(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // TODO: disable first because we are using dummy fetch
    fetchSupply();
    fetchHolders();

    async function fetchDummyHolders() {
      try {
        const response = await fetch("/holders10k.json");
        const data: { address: string; balance: number }[] =
          await response.json();
        const convertedData: Holder[] = data.map((holder) => ({
          wallet: holder.address,
          balance: holder.balance,
        }));

        const totalBalance = data.reduce(
          (total, holder) => total + holder.balance,
          0,
        );
        console.log("totalBalance:", totalBalance);

        setSupply(totalBalance);
        $supply.set(totalBalance);

        // console.log(convertedData);
        $holders.set(convertedData);
      } catch (error) {
        console.error("Failed to fetch holders:", error);
      }
    }

    // fetchDummyHolders();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* <FpsView /> */}
      <Navbar onSearch={handleSearch} />
      <Skeleton
        holders={data}
        searchedAddress={searchedAddress}
        supply={supply}
        height={maxY}
        onSearch={handleSearch}
      />
    
      </div>
  );
}
