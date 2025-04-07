import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { to, message } = await req.json();

  if (!to) {
    return NextResponse.json(
      { error: 'Recipient email is required' },
      { status: 400 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: 'Verify Your Email Address',
      text: message,
    };

    const response = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully!', response },
      { status: 200 },
    );
  } catch (error: unknown) {
    let message = 'Internal server error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
