import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';

const WeatherWidget = ({ location }) => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Mock weather data generation
        const generateWeather = () => {
            const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'];
            const condition = conditions[Math.floor(Math.random() * conditions.length)];
            const temp = Math.floor(Math.random() * (35 - 20) + 20); // 20-35 degrees

            return {
                temp,
                condition,
                humidity: Math.floor(Math.random() * (90 - 40) + 40),
                wind: Math.floor(Math.random() * (20 - 5) + 5)
            };
        };

        setWeather(generateWeather());
    }, [location]);

    if (!weather) return null;

    const getIcon = () => {
        switch (weather.condition) {
            case 'Sunny': return <Sun size={24} color="#f59e0b" />;
            case 'Rainy': return <CloudRain size={24} color="#3b82f6" />;
            case 'Cloudy': return <Cloud size={24} color="#6b7280" />;
            default: return <Cloud size={24} color="#60a5fa" />;
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(to right, #e0f2fe, #f0f9ff)',
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #bae6fd'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getIcon()}
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{weather.temp}°C</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{weather.condition}</div>
                </div>
            </div>

            <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }}></div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Droplets size={16} color="#0ea5e9" />
                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>{weather.humidity}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Wind size={16} color="#64748b" />
                    <span style={{ fontSize: '0.9rem', color: '#334155' }}>{weather.wind} km/h</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
