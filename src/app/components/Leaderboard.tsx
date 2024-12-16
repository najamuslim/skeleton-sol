// src/components/Leaderboards.tsx
import { HolderData } from "@/types";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import {
  $holdersData,
  $supply,
} from "../stores/holders";

interface Holder {
  rank: number;
  wallet: string;
  balance: number;
  percentage: string;
}

interface LeaderboardData {
  totalSupply: number;
  top7Holders: Holder[];
}

interface LeaderboardProps {
  onSearch: (address: string) => void;
}

export default function Leaderboards({ onSearch }: LeaderboardProps) {
  const [isActive, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const holders = useStore($holdersData);
  const supply = useStore($supply);
  const [top7Holders, setTop7Holders] = useState<Array<any>>([]);


  console.log(holders.length)
  useEffect(() => {
    setIsLoading(true);

    // Proses data dalam useEffect untuk menghindari blocking
    const processedHolders = holders
      .sort((a, b) => b.position.balance - a.position.balance)
      .slice(0, 7)
      .map((holder, index) => ({
        ...holder,
        rank: index + 1,
        percentage: ((holder.position.balance / supply) * 100).toFixed(2) + '%'
      }));

    setTop7Holders(processedHolders);
    setIsLoading(false);
  }, [holders,supply]);


  if(isLoading) return <div>Loading...</div>

  return (
    <div className="text-[#9B2823]">
      <div className="flex flex-col">
        <div className="bg-white shadow-lg">
          <button
            onClick={() => setActive(!isActive)}
            className="px-0.5 sm:px-1 py-0.5 hover:bg-gray-100 w-full text-left"
          >
            <span
              className={`
              inline-block transition-transform duration-300 text-xs
              ${isActive ? "" : "rotate-180"}
            `}
            >
              {`>>>`}
            </span>
          </button>
          <div className="px-1.5 md:px-2 pb-1">
            <p className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-base">
              Leaderboards
            </p>
          </div>
        </div>

        <div
          className={`
            bg-white shadow-lg
            transform transition-all duration-300 ease-in-out
            ${isActive
              ? "translate-x-0 opacity-100 h-auto"
              : "translate-x-full opacity-0 h-0"
            }
            overflow-hidden
          `}
        >
          <div className="w-full px-1 sm:px-1.5 md:px-2 pb-2">
            <hr className="border border-black my-1 sm:my-2" />
            <div className="flex justify-between font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-sm">
              <p className="w-1/6 text-center">Rank</p>
              <p className="w-3/6 text-center">Wallet</p>
              <p className="w-2/6 text-center">%</p>
            </div>
            {top7Holders.map((holder) => (
              <div
                key={holder.wallet}
                className="cursor-pointer hover:bg-gray-100 flex justify-between font-bold my-1 text-[8px] sm:text-[10px] md:text-xs lg:text-sm"
                onClick={() => onSearch(holder.wallet)} // tambahkan onClick handler
              >
                <p className="w-1/6 text-center">{holder.rank}</p>
                <p className="w-3/6 text-center">
                  {holder.wallet.slice(0, 5) + "..."}
                </p>
                <p className="w-2/6 text-center">{holder.percentage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}