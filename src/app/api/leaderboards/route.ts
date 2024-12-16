import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

export async function GET() {
  try {
    if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
      throw new Error("Missing required environment variables");
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const mintAddress = new PublicKey(TOKEN_MINT_ADDRESS);

    // Ambil supply token
    const supply = await connection.getTokenSupply(mintAddress);
    const totalSupply = Number(supply.value.amount);

    // Ambil semua token accounts
    const tokenAccounts = await connection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        commitment: "confirmed",
        filters: [
          {
            dataSize: 165,
          },
          {
            memcmp: {
              offset: 0,
              bytes: mintAddress.toBase58(),
            },
          },
        ],
      }
    );

    // Proses data untuk top 10 holders
    const top7Holders = tokenAccounts
      .map((account) => {
        const data = account.account.data;
        const owner = new PublicKey(data.slice(32, 64)).toBase58();
        const balance = Number(data.readBigUInt64LE(64));
        
        // Hitung persentase kepemilikan
        const percentage = (balance / totalSupply) * 100;

        return {
          rank: 0,
          wallet: owner,
          balance: balance,
          percentage: percentage.toFixed(2) + '%'
        };
      })
      .filter((holder) => holder.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 7);

    // Tambahkan ranking 1-10
    top7Holders.forEach((holder, index) => {
      holder.rank = index + 1;
    });

    return NextResponse.json({
      totalSupply: totalSupply,
      top7Holders: top7Holders
    });

  } catch (error: Error | unknown) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}