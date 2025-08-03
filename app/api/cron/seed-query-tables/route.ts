import { NextRequest, NextResponse } from "next/server";
import {
  USER_INTERACTIONS_QUERY,
  INTERVIEW_FEATURES_QUERY,
} from "@/constants/queries";
import { runBigQueryQuery } from "@/lib/bigQuery";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-vercel-cron-event-secret");
  if (secret !== process.env.CRON_SECRET) {
    console.error("Unauthorized cron job access attempt.");
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Running daily BigQuery data refresh jobs...");
  try {
    await runBigQueryQuery(USER_INTERACTIONS_QUERY);
    console.log("User interactions refresh complete.");

    await runBigQueryQuery(INTERVIEW_FEATURES_QUERY);
    console.log("Interview features refresh complete.");

    return NextResponse.json({
      success: true,
      message: "Daily data refresh successful!",
    });
  } catch (error: unknown) {
    console.error("Daily data refresh failed:", error);
    return NextResponse.json(
      { success: false, message: "Daily data refresh failed.", error },
      { status: 500 }
    );
  }
}
