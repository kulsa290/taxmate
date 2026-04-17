import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaxMate AI assistant shell', () => {
  render(<App />);
  expect(screen.getByText(/TaxMate AI Assistant/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Ask anything about tax/i)).toBeInTheDocument();
});
