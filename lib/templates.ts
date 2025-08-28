import env from "@/env";

export const generateEmailHTML = (
  interview: Partial<Interview>,
  timeString: string
): string => {
  return `
    <!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Interview Reminder</title>
  </head>

  <body style="margin:0;padding:0;background-color:#0b1220;">
     Full width wrapper 
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0b1220;">
      <tr>
        <td align="center" style="padding:24px;">
           Card 
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;border-radius:14px;overflow:hidden;background-color:#0b1220;">
             Header 
            <tr>
              <td style="padding:24px;background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="left">
                      <div style="display:inline-block;background:#ffffff;border-radius:9999px;padding:10px 14px;line-height:1;">
                        <span style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-weight:800;color:#0b1220;font-size:16px;letter-spacing:0.5px;">IH</span>
                      </div>
                    </td>
                    <td align="right" style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e5edff;font-size:12px;opacity:0.9;">
                      Scheduled interview reminder
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

             Body 
            <tr>
              <td style="background-color:#0f172a;padding:28px;">
                <h1 style="margin:0 0 8px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;color:#f8fafc;font-weight:700;">
                  Upcoming interview reminder
                </h1>
                <p style="margin:0 0 18px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#cbd5e1;">
                  Hi {{.UserName}}, this is a friendly reminder that your interview for
                  <span style="color:#93c5fd;font-weight:600;">{{.Role}}</span> is coming up. Be sure to join a few minutes early to check your mic and camera.
                </p>

                 Details box 
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0b1220;border:1px solid #1f2937;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#94a3b8;width:32%;">Role</td>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#e2e8f0;">${interview.role}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#94a3b8;">Date</td>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#e2e8f0;">${timeString}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#94a3b8;">Role</td>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#e2e8f0;">${interview.role})</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#94a3b8;">Type</td>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#e2e8f0;">{${interview.type}}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#94a3b8;">Difficulty</td>
                          <td style="padding:6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#e2e8f0;">${interview.difficulty}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                 CTA 
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:22px;">
                  <tr>
                    <td align="center">
                      <a href="${env.NEXT_PUBLIC_BASE_URL}/interview/${interview.id}"
                         style="display:inline-block;background-color:#3b82f6;color:#0b1220;text-decoration:none;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">
                        Go to interview
                      </a>
                    </td>
                  </tr>
                </table>

                 Fallback link 
                <p style="margin:18px 0 0 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#64748b;">
                  If the button doesn’t work, copy and paste this link into your browser:<br />
                  <a href="${env.NEXT_PUBLIC_BASE_URL}/interview/${interview.id}" style="color:#93c5fd;word-break:break-all;text-decoration:underline;">${env.NEXT_PUBLIC_BASE_URL}/interview/${interview.id}</a>
                </p>
              </td>
            </tr>

             Footer 
            <tr>
              <td style="background-color:#0b1220;padding:18px 24px;border-top:1px solid #1f2937;">
                <p style="margin:0 0 6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#94a3b8;">
                  You’re receiving this email because an interview was scheduled on Inthunt.
                </p>
                <p style="margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#475569;">
                  If you didn’t request this, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
           /Card 
        </td>
      </tr>
    </table>
  </body>
</html>

  `;
};
