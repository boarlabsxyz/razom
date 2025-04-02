import { GET } from './route';

describe('Health Check API', () => {
  it('should return 200 status and correct response body', async () => {
    const response = await GET();

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');

    const data = await response.json();
    expect(data).toEqual({ status: 'ok' });
  });
});
