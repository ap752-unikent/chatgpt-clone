import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('renders button with text', () => {
  render(<div>Click me</div>);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});
