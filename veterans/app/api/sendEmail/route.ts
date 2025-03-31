import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { to, message } = await req.json();

  if (!to) {
    return NextResponse.json(
      { error: 'Recipient email is required' },
      { status: 400 },
    );
  }

  try {
    const response = await resend.emails.send({
      from: 'RAZOM <onboarding@resend.dev>',
      to: [to],
      subject: 'Your Verification Code',
      text: message,
    });

    return NextResponse.json(
      { message: 'Email sent successfully!', response },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
