import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { db } from "@/drizzle";
import { interviews, scheduledInterviews } from "@/lib/schema";
import { createClient } from "@/supabase/admin";
import { and, eq, sql } from "drizzle-orm";
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

    const oneHourFromNow = dayjs().add(60, "minute");
    const oneHourFromNowEpoch = oneHourFromNow.unix();
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
          sql`extract(epoch from (${scheduledInterviews.scheduledAt} AT TIME ZONE ${scheduledInterviews.timezone})) > ${nowEpoch}`,
          sql`extract(epoch from (${scheduledInterviews.scheduledAt} AT TIME ZONE ${scheduledInterviews.timezone})) <= ${oneHourFromNowEpoch}`,
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

        console.log("User error", userError);

        if (userError || !user?.email) {
          errors++;
          continue;
        }

        const userEmail = user.email;
        const scheduledTime = dayjs(interview.scheduledAt).tz(
          interview.timezone
        );

        const timeString = scheduledTime.format("MMMM D, YYYY at h:mm A");
        const emailSubject = `Mock Interview Reminder - ${interview.role} Interview`;
        const emailHtml = generateEmailHTML(
          interview,
          timeString,
          user.user_metadata.name
        );

        const { error: emailError } = await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: userEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        console.log(emailError, "email error");

        if (emailError) {
          errors++;
          continue;
        }

        await db.update(scheduledInterviews).set({ reminderSent: true });
        emailsSent++;
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
