
import { useMemo, useState } from 'react';
import styles from './TransactionTable.module.css';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  'All',
  'Paid',
  'Pending',
  'Refunded',
  'Cancelled',
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? '—'
    : dateFormatter.format(date);
}

export default function TransactionTable({ transactions = [] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search, filter and sort without modifying the original API data.
  const filteredTransactions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const matchesSearch =
          !searchTerm ||
          String(transaction.transaction_id || '')
            .toLowerCase()
            .includes(searchTerm) ||
          String(transaction.package_name || '')
            .toLowerCase()
            .includes(searchTerm);

        const matchesStatus =
          statusFilter === 'All' ||
          transaction.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
     .sort((a, b) => {
  const dateA = a.booked_at || '';
  const dateB = b.booked_at || '';

  const dateComparison = String(dateA).localeCompare(String(dateB));

  if (dateComparison !== 0) {
    return sortOrder === 'desc'
      ? -dateComparison
      : dateComparison;
  }

  return String(a.transaction_id || '').localeCompare(
    String(b.transaction_id || '')
  );
});
  }, [transactions, search, statusFilter, sortOrder]);

  const totalPages = Math.ceil(
    filteredTransactions.length / PAGE_SIZE
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const currentTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const firstRecord =
    filteredTransactions.length === 0 ? 0 : startIndex + 1;

  const lastRecord = Math.min(
    startIndex + PAGE_SIZE,
    filteredTransactions.length
  );

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  function handleStatusChange(event) {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  }

  function toggleDateSort() {
    setSortOrder((previous) =>
      previous === 'desc' ? 'asc' : 'desc'
    );
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  const statusClasses = {
    Paid: styles.statusPaid,
    Pending: styles.statusPending,
    Refunded: styles.statusRefunded,
    Cancelled: styles.statusCancelled,
  };

  return (
    <section
      id="transactions"
      className={styles.panel}
      aria-labelledby="transaction-heading"
    >
      <div className={styles.panelHeader}>
        <div>
          <h2 id="transaction-heading">
            Transactions
            <small>({transactions.length} loaded)</small>
          </h2>

          <p className={styles.description}>
            View and manage booking transactions.
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchGroup}>
          <label htmlFor="transaction-search">
            Search transactions
          </label>

          <input
            id="transaction-search"
            type="search"
            placeholder="Search transaction ID or package..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.statusGroup}>
          <label htmlFor="status-filter">
            Payment status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All statuses' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className={styles.tableWrapper}
        tabIndex={0}
        role="region"
        aria-label="Transaction records. Scroll horizontally to view all columns."
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Transaction ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Package</th>

              <th
                scope="col"
                aria-sort={
                  sortOrder === 'asc' ? 'ascending' : 'descending'
                }
              >
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={toggleDateSort}
                  aria-label={`Sort booking date ${
                    sortOrder === 'desc' ? 'oldest first' : 'newest first'
                  }`}
                >
                  Booking date
                  <span aria-hidden="true">
                    {sortOrder === 'desc' ? ' ↓' : ' ↑'}
                  </span>
                </button>
              </th>

              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td className={styles.transactionId}>
                  {transaction.transaction_id}
                </td>

                <td>{transaction.customer_label || '—'}</td>

                <td className={styles.packageName}>
                  {transaction.package_name || '—'}
                </td>

                <td>{formatDate(transaction.booked_at)}</td>

                <td className={styles.amount}>
                  {currencyFormatter.format(
                    Number(transaction.amount_inr || 0)
                  )}
                </td>

                <td>
                  <span
                    className={`${styles.status} ${
                      statusClasses[transaction.status] || ''
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}

            {currentTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  <strong>No transactions found</strong>
                  <span>
                    Try changing your search or payment status filter.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <p aria-live="polite">
          Showing {firstRecord}–{lastRecord} of{' '}
          {filteredTransactions.length} transactions
        </p>

        <div className={styles.paginationControls}>
          <button
            type="button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || totalPages === 0}
            aria-label="Go to previous page"
          >
            Previous
          </button>

          <span aria-current="page">
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
