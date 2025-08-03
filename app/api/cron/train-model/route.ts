import { NextRequest, NextResponse } from "next/server";
import { runBigQueryQuery } from "@/lib/bigQuery";
import { TRAIN_MODEL_QUERY } from "@/constants/queries";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-vercel-cron-event-secret");
  if (secret !== process.env.CRON_SECRET) {
    console.error("Unauthorized cron job access attempt.");
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Starting weekly BigQuery model retraining...");
  try {
    await runBigQueryQuery(TRAIN_MODEL_QUERY);
    console.log("Model retraining completed.");

    return NextResponse.json({
      success: true,
      message: "Weekly model retraining successful!",
    });
  } catch (error) {
    console.error("Weekly model retraining failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Weekly model retraining failed.",
        error,
      },
      { status: 500 }
    );
  }
}
