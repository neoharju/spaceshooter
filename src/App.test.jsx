// src/App.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

// Mock the SpaceShooter component to avoid canvas/game logic issues
vi.mock('./SpaceShooter.jsx', () => ({
  default: () => <div data-testid="space-shooter">Space Shooter Game</div>
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('space-shooter')).toBeInTheDocument();
  });

  it('renders the SpaceShooter component', () => {
    render(<App />);
    expect(screen.getByText('Space Shooter Game')).toBeInTheDocument();
  });
})
