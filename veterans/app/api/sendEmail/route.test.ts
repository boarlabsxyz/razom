jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, { status }) => {
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  },
}));

describe('POST /api/sendEmail', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return error if "to" is missing', async () => {
    const { POST } = await import('./route');
    const req = {
      json: jest.fn().mockResolvedValue({ to: '', message: 'Hello' }),
    } as unknown as Request;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.error).toBe('Recipient email is required');
  });

  it('should send an email successfully and return a success response', async () => {
    const { POST } = await import('./route');
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({ to: 'test@example.com', message: 'Hello' }),
    } as unknown as Request;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toBe('Email sent successfully!');
    expect(jsonResponse.response).toHaveProperty('messageId', 'test-id');
  });

  it('should return a 500 error if sending email fails', async () => {
    const nodemailer = await import('nodemailer');
    (nodemailer.createTransport as jest.Mock).mockReturnValueOnce({
      sendMail: jest.fn().mockRejectedValue(new Error('Test error message')),
    });

    const { POST } = await import('./route');
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({ to: 'test@example.com', message: 'Hello' }),
    } as unknown as Request;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.error).toBe('Test error message');
  });
});
