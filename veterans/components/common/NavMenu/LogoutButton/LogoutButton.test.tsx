import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import LogoutButton from './LogoutButton';
import { LOGOUT_MUTATION } from 'constants/graphql';

const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

const mocks = [
  {
    request: { query: LOGOUT_MUTATION },
    result: { data: { endSession: true } },
  },
];

describe('LogoutButton', () => {
  it('calls logout mutation and reloads the page', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <LogoutButton />
      </MockedProvider>,
    );

    const button = screen.getByText('Вийти');

    await act(async () => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(mockReload).toHaveBeenCalled();
    });
  });
});
