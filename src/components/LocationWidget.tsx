"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WeatherData {
    temperature: number;
    weatherCode: number;
}

const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "🌤️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 55) return "🌦️";
    if (code >= 61 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 75) return "❄️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code === 95 || code === 96 || code === 99) return "⛈️";
    return "☁️";
};

export default function LocationWidget() {
    const [time, setTime] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);

    useEffect(() => {
        // Update time every minute
        const updateClock = () => {
            const now = new Date();
            // User requested Panipat, Haryana time. We use Asia/Kolkata timezone.
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
            setTime(formatter.format(now));
        };

        updateClock();
        const intervalId = setInterval(updateClock, 1000 * 60); // update every minute

        // Fetch weather from open-meteo (Panipat: lat: 29.3909, lon: 76.9709)
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=29.3909&longitude=76.9709&current=temperature_2m,weather_code"
                );
                if (!res.ok) throw new Error("Failed to fetch weather");
                const data = await res.json();
                setWeather({
                    temperature: Math.round(data.current.temperature_2m),
                    weatherCode: data.current.weather_code,
                });
            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        };

        fetchWeather();

        return () => clearInterval(intervalId);
    }, []);

    // Provide a fallback to avoid hydration mismatches
    if (!time) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-base font-bold font-serif text-neutral-800 dark:text-neutral-100 shadow-sm w-fit"
        >
            <span className="flex items-center gap-1.5">
                <span>📍</span>
                <span>Currently working from Panipat, Haryana</span>
            </span>
            <span className="opacity-50">·</span>
            {weather ? (
                <span className="flex items-center gap-1.5">
                    <span>{getWeatherIcon(weather.weatherCode)}</span>
                    <span>{weather.temperature}°C</span>
                </span>
            ) : (
                <span className="flex items-center gap-1.5 animate-pulse">
                    <span>☁️</span>
                    <span>--°C</span>
                </span>
            )}
            <span className="opacity-50">·</span>
            <span className="flex items-center gap-1.5">
                <span>🕑</span>
                <span>{time}</span>
            </span>
        </motion.div>
    );
}
