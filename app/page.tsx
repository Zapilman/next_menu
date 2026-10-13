import Image from "next/image";
import styles from "./page.module.css";
import { VenueInfo } from "./components/VenueInfo/VenueInfo";
import Link from "next/link";

export default function Home() {

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <VenueInfo />
        <Link href="/menu">Menu</Link>
      </main>
    </div>
  );
}
