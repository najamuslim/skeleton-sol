/* eslint-disable @typescript-eslint/no-explicit-any */
import { Holder } from "@/types";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    // get json data from public dir holders10k.json
    const holdersPath = path.join(process.cwd(), "public/holders10k.json");
    const holdersData: Holder[] = JSON.parse(
      fs.readFileSync(holdersPath, "utf-8"),
    );

    console.log(holdersData);

    return NextResponse.json({ message: "hello world" });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
