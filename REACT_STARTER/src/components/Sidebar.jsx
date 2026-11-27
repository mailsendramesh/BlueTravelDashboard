import styles from './Sidebar.module.css';
import logo from '../assets/logo.svg';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}
      aria-label="Dashboard navigation">

      <div className={styles.brand}>
        <img src={logo} alt="BlueTrail Travel Operations" />
      </div>

      <nav aria-label="Main navigation">
        <a href="#main-content" aria-current="page">
          Overview
        </a>
        <a href="#transactions">
          Transactions
        </a>
      </nav>

    </aside>
  );
}