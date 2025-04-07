import { generateSecureCode } from '@helpers/generateSecureCode';

export const handleSendEmail = async (
  email: string,
): Promise<{ success: boolean; code?: string }> => {
  const newCode = generateSecureCode();

  const message = `You need to verify your email address. Enter the following code to verify your email address: ${newCode}`;

  try {
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, message }),
    });

    await response.json();

    if (response.ok) {
      // eslint-disable-next-line no-alert
      alert('Verification email sent! Check your inbox.');
      return { success: true, code: newCode };
    } else {
      throw new Error('Failed to send verification email');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending email:', error);
    return { success: false };
  }
};
