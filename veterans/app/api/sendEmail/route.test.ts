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
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should return error if "to" is missing', async () => {
    jest.doMock('resend', () => ({
      Resend: jest.fn(() => ({
        emails: { send: jest.fn() },
      })),
    }));

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
    jest.doMock('resend', () => ({
      Resend: jest.fn(() => ({
        emails: { send: jest.fn().mockResolvedValue({ status: 'success' }) },
      })),
    }));

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
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      jest.resetModules();
      jest.clearAllMocks();
    });

    it('should return a 500 error if sending email fails', async () => {
      jest.doMock('resend', () => ({
        Resend: jest.fn(() => ({
          emails: {
            send: jest.fn().mockRejectedValue(new Error('Test error message')),
          },
        })),
      }));

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
});
