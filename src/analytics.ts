// src/analytics.js
import ReactGA from "react-ga4";

export const initGA = (): void => {
    ReactGA.initialize("G-X3VH34YWQK"); // 측정 ID 입력
};

export const logPageView = (path: string): void => {
    ReactGA.send({ hitType: "pageview", page: path });
};