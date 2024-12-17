import { useStore } from "@nanostores/react";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { $isLoading } from "../stores/skeleton";

export default function LoadingScreen() {
  const isLoading = useStore($isLoading);

  const [counter, setCounter] = useState(0);

  // fill counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      // loop counter 1-10
      setCounter((prev) => (prev >= 10 ? 0 : prev + 1));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={classNames(
        "fixed bg-[#F6AA30] z-30 border-frame flex flex-col items-center justify-center h-screen w-screen transition duration-300",
        {
          "opacity-100": isLoading,
          "opacity-0": !isLoading,
          "pointer-events-none": !isLoading,
        },
      )}
    >
      <div className="">
        <h1 className="text-center text-4xl md:text-6xl lg:text-[90px] font-bold text-[#9B2823]">
          NOW LOADING
        </h1>

        <div className="flex gap-[10px] mt-[26px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`loading-screen-${i}`}
              className={classNames(
                "w-4 h-4 md:w-8 md:h-8 lg:w-[54px] lg:h-[54px] bg-[#A23733] transition",
                {
                  "opacity-100": counter >= i + 1,
                  "opacity-10": counter < i + 1,
                },
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
