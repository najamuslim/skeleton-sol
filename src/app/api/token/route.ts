/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;

export async function GET() {
  if (!SOLANA_RPC_URL || !TOKEN_MINT_ADDRESS) {
    throw new Error("Missing required environment variables");
  }
  try {
    const connection = new Connection(SOLANA_RPC_URL, "confirmed");
    const mintPubkey = new PublicKey(TOKEN_MINT_ADDRESS);
    const supply = await connection.getTokenSupply(mintPubkey);

    // Konversi ke number dengan mempertimbangkan decimals
    const totalSupply =
      Number(supply.value.amount) / Math.pow(10, supply.value.decimals);
    return NextResponse.json(totalSupply);
  } catch (error: any) {
    console.error("Error fetching token supply:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fungsi tambahan terkait token bisa ditambahkan di sini
export async function getTokenMetadata(
  connection: Connection,
  tokenMintAddress: string
) {
  try {
    const mintPubkey = new PublicKey(tokenMintAddress);
    const info = await connection.getParsedAccountInfo(mintPubkey);
    return info;
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw error;
  }
}
