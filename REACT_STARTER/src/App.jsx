
import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import styles from './App.module.css';

const API =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4177';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [loadState, setLoadState] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API}/api/transactions`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load transactions');
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid transaction data');
        }

        setTransactions(data);
        setLoadState('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setLoadState('error');
        }
      });

    return () => controller.abort();
  }, []);

  // Calculate KPI values from the API transactions.
  const metrics = useMemo(() => {
    const paidTransactions = transactions.filter(
      (transaction) => transaction.status === 'Paid'
    );

    const grossPaidRevenue = paidTransactions.reduce(
      (total, transaction) => total + Number(transaction.amount_inr || 0),
      0
    );

    const totalBookings = transactions.length;

    const pendingPayments = transactions.filter(
      (transaction) => transaction.status === 'Pending'
    ).length;

    const averagePaidValue =
      paidTransactions.length > 0
        ? grossPaidRevenue / paidTransactions.length
        : 0;

    return {
      grossPaidRevenue,
      totalBookings,
      pendingPayments,
      averagePaidValue,
    };
  }, [transactions]);

  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.workspace}>
        <Header />

        <main id="main-content" className={styles.content}>
          <h1>Travel operations</h1>
          <p>Booking and transaction overview</p>

          {loadState === 'loading' && (
            <p role="status">Loading transactions…</p>
          )}

          {loadState === 'error' && (
            <p role="alert">
              Transactions could not be loaded. Start the local API and refresh.
            </p>
          )}

          {loadState === 'ready' && (
            <>
              <section
                aria-label="Key performance indicators"
                className={styles.cards}
              >
                <SummaryCard
                  title="Gross paid revenue"
                  value={currencyFormatter.format(metrics.grossPaidRevenue)}
                  detail="Paid transactions only"
                />

                <SummaryCard
                  title="Total bookings"
                  value={metrics.totalBookings.toLocaleString('en-IN')}
                  detail="Including refunded and cancelled bookings"
                />

                <SummaryCard
                  title="Pending payments"
                  value={metrics.pendingPayments.toLocaleString('en-IN')}
                  detail="Awaiting payment"
                />

                <SummaryCard
                  title="Average paid value"
                  value={currencyFormatter.format(metrics.averagePaidValue)}
                  detail="Average per paid transaction"
                />
              </section>

              <TransactionTable transactions={transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
