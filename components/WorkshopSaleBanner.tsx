"use client";

import { useEffect, useState } from "react";
import { resolveSaleDeadline, saleSecondsRemaining, saleTimeParts, WORKSHOP_SALE_CONFIG, type WorkshopSaleConfig } from "@/lib/homepage/sale";
import styles from "./HomePageClient.module.css";

export default function WorkshopSaleBanner({ config = WORKSHOP_SALE_CONFIG }: { config?: WorkshopSaleConfig }) {
  const [clock, setClock] = useState({ seconds: 0, hourDigits: 2 });

  useEffect(() => {
    const deadline = resolveSaleDeadline(config, Date.now());
    setClock({ seconds: 0, hourDigits: 2 });
    if (deadline === null) return;
    const initialSeconds = saleSecondsRemaining(deadline, Date.now());
    if (initialSeconds === 0) return;
    const hourDigits = Math.max(2, String(Math.floor(initialSeconds / 3600)).length);
    let expired = false;
    const update = () => {
      if (expired) return;
      const seconds = saleSecondsRemaining(deadline, Date.now());
      setClock({ seconds, hourDigits });
      if (seconds === 0) {
        expired = true;
        window.clearInterval(interval);
      }
    };
    const interval = window.setInterval(update, 1000);
    update();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, [config]);

  const active = clock.seconds > 0;
  const parts = saleTimeParts(clock.seconds, clock.hourDigits);
  const labels = ["HOURS", "MINUTES", "SECONDS"];

  return (
    <aside className={styles.saleBanner} aria-label={active ? "Flash studio sale notice" : "Workshop offers"}>
      <div className={styles.saleBannerInner}>
        {active && <span className={styles.saleUrgencyPill}>⏰ Flash Sale</span>}
        <p className={styles.saleBannerText}>
          <strong>{active ? "Special workshop discount pricing active now" : "Workshop offers"}</strong>
          {active && <span className={styles.saleCountdown}>
            <span>— Sale ends in</span>
            <span className={styles.saleTimer} role="timer" aria-live="off" aria-label={`Sale ends in ${Number(parts[0])} hours, ${Number(parts[1])} minutes, ${Number(parts[2])} seconds`}>
              {parts.map((number, index) => <span key={labels[index]} className={styles.saleTimeUnit} aria-hidden="true">
                {index > 0 && <span className={styles.saleTimeSeparator}>:</span>}
                <span className={styles.saleTimeNumber}>{number}</span>
                <span className={styles.saleTimeLabel}>{labels[index]}</span>
              </span>)}
            </span>
          </span>}
        </p>
        <span className={styles.saleBannerNote}>Discount applied automatically at checkout · Strikethrough shows original price</span>
      </div>
    </aside>
  );
}
