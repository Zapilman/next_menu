"use client";

import { useState } from "react";
import styles from "./dish-card.module.css";

export const Composition = ({ composition }: { composition: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div >
            <p className={styles.compositionText + (isOpen ? "" : " " + styles.collapsed)}>{composition}</p>
            <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "Hide" : "Show"}
            </button>
        </div>
    );
};