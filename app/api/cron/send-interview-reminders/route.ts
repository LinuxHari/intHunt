// import { NextRequest, NextResponse } from "next/server";
// import { Resend } from "resend";
// import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
// import { db } from "@/drizzle";
// import { scheduledInterviews } from "@/lib/schema";
// import { type } from "os";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const resend = new Resend(process.env.RESEND_API_KEY!);

// export async function POST(request: NextRequest) {
//   // Optional: Add authentication
//   const authHeader = request.headers.get("authorization");
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     console.log("🚀 Starting interview reminder check...");

//     const fifteenMinutesFromNow = dayjs().add(15, "minute").toISOString();
//     const now = dayjs().toISOString();

//     const { data: scheduledInterviewList, error } = await db
//       .select(
//         id,
//         user_id,
//         scheduled_at,
//         timezone,
//         reminder_sent,
//         id,
//         role,
//         type,
//         difficulty,
//         description,
//         is_deleted
//       )
//       .from(scheduledInterviews)
//       .lte("scheduled_at", fifteenMinutesFromNow)
//       .gt("scheduled_at", now)
//       .eq("reminder_sent", false)
//       .eq("interviews.is_deleted", false);

//     if (error) throw error;

//     console.log(
//       `📋 Found ${
//         scheduledInterviews?.length || 0
//       } interviews needing reminders`
//     );

//     let emailsSent = 0;
//     let errors = 0;

//     for (const interview of scheduledInterviews || []) {
//       try {
//         const {
//           data: { user },
//           error: userError,
//         } = await supabase.auth.admin.getUserById(interview.user_id);

//         if (userError || !user?.email) {
//           errors++;
//           continue;
//         }

//         const userEmail = user.email;
//         const userName = user.user_metadata?.full_name || "there";
//         const scheduledTime = dayjs(interview.scheduled_at).tz(
//           interview.timezone
//         );
//         const timeString = scheduledTime.format("MMMM D, YYYY at h:mm A z");

//         const emailSubject = `🎯 Mock Interview Reminder - ${interview.interviews.role} Interview`;

//         // Use the same generateEmailHTML function from above
//         const emailHtml = generateEmailHTML(interview, userName, timeString);

//         const { error: emailError } = await resend.emails.send({
//           from: `Mock Interview <${
//             process.env.FROM_EMAIL || "noreply@yourdomain.com"
//           }>`,
//           to: userEmail,
//           subject: emailSubject,
//           html: emailHtml,
//         });

//         if (emailError) {
//           errors++;
//           continue;
//         }

//         const { error: updateError } = await supabase
//           .from("scheduledInterviews")
//           .update({
//             reminder_sent: true,
//             email_sent_at: new Date().toISOString(),
//           })
//           .eq("id", interview.id);

//         if (updateError) {
//           errors++;
//         } else {
//           emailsSent++;
//         }
//       } catch (error) {
//         errors++;
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: `Processed ${scheduledInterviews?.length || 0} interviews`,
//       emailsSent,
//       errors,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error: any) {
//     console.error("💥 Function error:", error);
//     return NextResponse.json(
//       {
//         error: error.message,
//         timestamp: new Date().toISOString(),
//       },
//       { status: 500 }
//     );
//   }
// }

// function generateEmailHTML(
//   interview: ScheduledInterview,
//   userName: string,
//   timeString: string
// ): string {
//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Mock Interview Reminder</title>
//     </head>
//     <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">

//       <!-- Header -->
//       <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 15px; color: white; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);">
//         <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎯 Interview Alert!</h1>
//         <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your mock interview starts in 15 minutes</p>
//       </div>

//       <!-- Main Content -->
//       <div style="background: white; border-radius: 15px; padding: 30px; margin-bottom: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
//         <h2 style="color: #333; margin-top: 0; margin-bottom: 20px; font-size: 24px;">Hi ${userName}! 👋</h2>

//         <p style="margin-bottom: 25px; font-size: 16px; color: #555;">
//           Get ready! Your mock interview is about to begin. This is your moment to shine! ✨
//         </p>

//         <!-- Interview Details Card -->
//         <div style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%); padding: 25px; border-radius: 12px; border: 1px solid #e1e8ff; margin-bottom: 25px;">
//           <h3 style="color: #667eea; margin-top: 0; margin-bottom: 20px; font-size: 20px; display: flex; align-items: center;">
//             📋 Interview Details
//           </h3>

//           <div style="display: grid; gap: 12px;">
//             <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(102, 126, 234, 0.1);">
//               <span style="font-weight: 600; color: #4a5568;">Role:</span>
//               <span style="color: #667eea; font-weight: 500;">${interview.interviews.role}</span>
//             </div>

//             <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(102, 126, 234, 0.1);">
//               <span style="font-weight: 600; color: #4a5568;">Type:</span>
//               <span style="color: #667eea; font-weight: 500;">${interview.interviews.type}</span>
//             </div>

//             <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(102, 126, 234, 0.1);">
//               <span style="font-weight: 600; color: #4a5568;">Difficulty:</span>
//               <span style="color: #667eea; font-weight: 500;">${interview.interviews.difficulty}</span>
//             </div>

//             <div style="display: flex; justify-content: space-between; padding: 12px 0;">
//               <span style="font-weight: 600; color: #4a5568;">Time:</span>
//               <span style="color: #667eea; font-weight: 500;">${timeString}</span>
//             </div>
//           </div>
//         </div>

//         <!-- Pre-Interview Checklist -->
//         <div style="background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%); border: 2px solid #ffd54f; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
//           <h3 style="color: #f57f17; margin-top: 0; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center;">
//             ✅ Quick Pre-Interview Checklist
//           </h3>

//           <ul style="margin: 0; padding-left: 20px; color: #5d4e75;">
//             <li style="margin-bottom: 10px; font-size: 15px;">🌐 <strong>Internet:</strong> Test your connection speed</li>
//             <li style="margin-bottom: 10px; font-size: 15px;">🎤 <strong>Audio/Video:</strong> Check microphone and camera</li>
//             <li style="margin-bottom: 10px; font-size: 15px;">🔇 <strong>Environment:</strong> Find a quiet, well-lit space</li>
//             <li style="margin-bottom: 10px; font-size: 15px;">📄 <strong>Materials:</strong> Have resume and notes ready</li>
//             <li style="margin-bottom: 0; font-size: 15px;">💻 <strong>Focus:</strong> Close unnecessary applications</li>
//           </ul>
//         </div>

//         <!-- CTA Button -->
//         <div style="text-align: center; margin: 35px 0;">
//           <a href="${siteUrl}/interview/scheduled/${interview.id}"
//              style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 50px; display: inline-block; font-weight: bold; font-size: 18px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
//             🚀 Join Interview Now
//           </a>
//         </div>

//         <!-- Motivational Message -->
//         <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%); padding: 20px; border-radius: 10px; border-left: 5px solid #4caf50; text-align: center;">
//           <p style="margin: 0; color: #2e7d32; font-size: 16px; font-style: italic;">
//             💪 "Success is where preparation and opportunity meet. You've got this!"
//           </p>
//         </div>
//       </div>

//       <!-- Footer -->
//       <div style="text-align: center; padding: 30px; background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
//         <p style="margin: 0 0 10px 0; font-size: 16px; color: #333;">
//           🍀 <strong>Best of luck with your interview!</strong>
//         </p>
//         <p style="margin: 0; font-size: 14px; color: #666;">
//           From your friends at <strong style="color: #667eea;">Mock Interview Platform</strong>
//         </p>
//       </div>

//       <!-- Unsubscribe (optional) -->
//       <div style="text-align: center; margin-top: 20px; padding: 15px;">
//         <p style="margin: 0; font-size: 12px; color: #999;">
//           You're receiving this because you scheduled a mock interview.
//         </p>
//       </div>
//     </body>
//     </html>
//   `;
// }
