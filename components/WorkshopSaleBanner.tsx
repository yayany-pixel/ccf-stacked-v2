"use client";

import { useEffect, useState } from "react";
import { resolveSaleDeadline, saleSecondsRemaining, saleTimeUnits, WORKSHOP_SALE_CONFIG, type WorkshopSaleConfig } from "@/lib/homepage/sale";
import styles from "./HomePageClient.module.css";

export default function WorkshopSaleBanner({ config = WORKSHOP_SALE_CONFIG }: { config?: WorkshopSaleConfig }) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = resolveSaleDeadline(config, Date.now());
    if (deadline === null) {
      setSecondsRemaining(null);
      return;
    }
    const initialSeconds = saleSecondsRemaining(deadline, Date.now());
    setSecondsRemaining(initialSeconds);
    if (initialSeconds === 0) return;

    let expired = false;
    const update = () => {
      if (expired) return;
      const seconds = saleSecondsRemaining(deadline, Date.now());
      setSecondsRemaining(seconds);
      if (seconds === 0) {
        expired = true;
        window.clearInterval(interval);
      }
    };
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, [config]);

  const active = secondsRemaining !== null && secondsRemaining > 0;
  const units = active ? saleTimeUnits(secondsRemaining) : [];
  const accessibleText = units.map(u => `${Number(u.value)} ${u.label.toLowerCase()}`).join(", ");

  return (
    <aside className={styles.saleBanner} aria-label={active ? "Flash studio sale notice" : "Workshop offers"}>
      <div className={styles.saleBannerInner}>
        {active && <span className={styles.saleUrgencyPill}>⏰ Flash Sale</span>}
        <p className={styles.saleBannerText}>
          <strong>{active ? "Special workshop discount pricing active now" : "Workshop offers"}</strong>
          {active && <span className={styles.saleCountdown}>
            <span>— Sale ends in</span>
            <span className={styles.saleTimer} role="timer" aria-live="off" aria-label={`Sale ends in ${accessibleText}`}>
              {units.map((unit, index) => <span key={unit.label} className={styles.saleTimeUnit} aria-hidden="true">
                {index > 0 && <span className={styles.saleTimeSeparator}>:</span>}
                <span className={styles.saleTimeNumber}>{unit.value}</span>
                <span className={styles.saleTimeLabel}>{unit.label}</span>
              </span>)}
            </span>
          </span>}
        </p>
        <span className={styles.saleBannerNote}>Discount applied automatically at checkout · Strikethrough shows original price</span>
      </div>
    </aside>
  );
}
