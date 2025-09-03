import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { db } from "@/drizzle";
import { interviews, scheduledInterviews } from "@/lib/schema";
import { createClient } from "@/supabase/admin";
import { and, eq, lte, sql } from "drizzle-orm";
import { generateEmailHTML } from "@/lib/templates";
import env from "@/env";

dayjs.extend(utc);
dayjs.extend(timezone);

const resend = new Resend(env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Starting interview reminder check...");

    const supabase = await createClient();

    const fifteenMinutesFromNow = dayjs().add(15, "minute").toDate();
    const nowEpoch = dayjs().unix();

    const scheduledInterviewList = await db
      .select({
        id: scheduledInterviews.interviewId,
        scheduledAt: scheduledInterviews.scheduledAt,
        userId: scheduledInterviews.userId,
        timezone: scheduledInterviews.timezone,
        role: interviews.role,
        type: interviews.type,
        difficulty: interviews.difficulty,
      })
      .from(scheduledInterviews)
      .innerJoin(interviews, eq(scheduledInterviews.interviewId, interviews.id))
      .where(
        and(
          lte(scheduledInterviews.scheduledAt, fifteenMinutesFromNow),
          sql`extract(epoch from (${scheduledInterviews.scheduledAt} AT TIME ZONE ${scheduledInterviews.timezone})) > ${nowEpoch}`,
          eq(scheduledInterviews.reminderSent, false)
        )
      );

    console.log(
      `Found ${
        scheduledInterviewList?.length || 0
      } interviews needing reminders`
    );

    let emailsSent = 0;
    let errors = 0;

    for (const interview of scheduledInterviewList) {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.admin.getUserById(interview.userId);

        if (userError || !user?.email) {
          errors++;
          continue;
        }

        const userEmail = user.email;
        const scheduledTime = dayjs(interview.scheduledAt).tz(
          interview.timezone
        );
        const timeString = scheduledTime.format("MMMM D, YYYY at h:mm A z");
        const emailSubject = `Mock Interview Reminder - ${interview.role} Interview`;
        const emailHtml = generateEmailHTML(interview, timeString);

        const { error: emailError } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: userEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        if (emailError) {
          errors++;
          continue;
        }

        const { error: updateError } = await supabase
          .from("scheduledInterviews")
          .update({
            reminder_sent: true,
            email_sent_at: new Date().toISOString(),
          })
          .eq("id", interview.id);

        if (updateError) {
          errors++;
        } else {
          emailsSent++;
        }
      } catch (error: unknown) {
        console.error("Error sending email", error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${scheduledInterviewList?.length || 0} interviews`,
      emailsSent,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Function error:", error);
    return NextResponse.json(
      {
        error,
        timestamp: dayjs().toISOString(),
      },
      { status: 500 }
    );
  }
}
