import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  // If no API key in dev, log to console instead of crashing
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 [DEV] Email would be sent:');
    console.log('  To:', to);
    console.log('  Subject:', subject);
    console.log('  HTML:', html.substring(0, 200) + '...');
    return { id: 'dev-no-email-sent' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || 'Pothos DB <noreply@pothosdb.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('Email send failed:', err);
    throw err;
  }
}