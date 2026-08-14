import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Expenses from '../pages/Expenses';
import Incomes from '../pages/Incomes';
import Subscriptions from '../pages/Subscriptions';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { CurrencyProvider } from '../context/CurrencyContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <CurrencyProvider>
        <UserProvider>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </UserProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
};

describe('Finance Frontend Tests (Expenses, Incomes, Subscriptions)', () => {
  it('should render expenses section correctly', async () => {
    renderWithProviders(<Expenses />);
    const expElement = await screen.findByText(/exp_title/i);
    expect(expElement).toBeInTheDocument();
  });

  it('should render incomes section correctly', async () => {
    renderWithProviders(<Incomes />);
    const incElement = await screen.findByText(/inc_title/i);
    expect(incElement).toBeInTheDocument();
  });

  it('should render subscriptions section correctly', async () => {
    renderWithProviders(<Subscriptions />);
    const subsElement = await screen.findByText(/subs_title/i);
    expect(subsElement).toBeInTheDocument();
  });
});