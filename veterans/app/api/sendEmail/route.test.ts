import { POST } from './route';
import { Resend } from 'resend';

jest.mock('resend', () => ({
  Resend: jest.fn(() => ({
    emails: {
      send: jest.fn(),
    },
  })),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, { status }) => ({
      status,
      json: async () => body,
    })),
  },
}));

describe('POST /api/sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if "to" is missing', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ to: '', message: 'Hello' }),
    } as unknown as Request;

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.error).toBe('Recipient email is required');
  });

  it('should send an email successfully and return a success response', async () => {
    const req = {
      json: jest
        .fn()
        .mockResolvedValue({ to: 'test@example.com', message: 'Hello' }),
    } as unknown as Request;

    const mockSend = jest.fn().mockResolvedValue({ status: 'success' });
    (Resend as jest.Mock).mockImplementationOnce(() => ({
      emails: { send: mockSend },
    }));

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse.message).toBe('Email sent successfully!');
  });
});
