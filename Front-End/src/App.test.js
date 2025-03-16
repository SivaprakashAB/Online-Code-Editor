import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Online Code Editor title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Online Code Editor/i);
  expect(titleElement).toBeInTheDocument();
});
