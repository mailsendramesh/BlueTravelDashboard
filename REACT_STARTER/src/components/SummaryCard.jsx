import styles from './SummaryCard.module.css';
export default function SummaryCard({ title, value, detail }) {return <article className={styles.card}><h2>{title}</h2><strong>{value}</strong>{detail && <p>{detail}</p>}</article>;}
