import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

import indiaTopo from '../data/india-topo.json';

const INDIA_TOPO_JSON = {
    ...indiaTopo,
    objects: {
        india: indiaTopo.objects.india
    }
};



const IndiaMap = ({ onSelectState }) => {
    const [tooltipContent, setTooltipContent] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const onMouseEnter = (geo, current = { value: 'NA' }) => {
        return () => {
            setTooltipContent(`${geo.properties.NAME_1}`);
        };
    };

    const onMouseLeave = () => {
        setTooltipContent('');
    };

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    return (
        <div
            className="map-container"
            style={{
                width: '100%',
                maxWidth: '900px',
                height: 'auto',
                aspectRatio: '4/5',
                position: 'relative',
                margin: '0 auto',
            }}
            onMouseMove={handleMouseMove}
        >
            <ComposableMap
                projectionConfig={{ scale: 1100, center: [82, 22] }}
                projection="geoMercator"
                width={800}
                height={1000}
                style={{ width: "100%", height: "auto" }}
            >
                <Geographies geography={INDIA_TOPO_JSON}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            // Usually the properties have name
                            const stateName = geo.properties.NAME_1 || geo.properties.name;

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={() => setTooltipContent(stateName)}
                                    onMouseLeave={() => setTooltipContent('')}
                                    onClick={() => onSelectState(stateName)}
                                    style={{
                                        default: {
                                            fill: '#D6D6DA',
                                            outline: 'none',
                                            stroke: '#FFFFFF',
                                            strokeWidth: 0.5,
                                            transition: 'all 250ms',
                                        },
                                        hover: {
                                            fill: 'var(--primary-color)',
                                            outline: 'none',
                                            cursor: 'pointer',
                                            filter: 'drop-shadow(0 0 10px rgba(0, 53, 128, 0.4))'
                                        },
                                        pressed: {
                                            fill: 'var(--primary-hover)',
                                            outline: 'none',
                                        },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>

            {tooltipContent && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePosition.y + 10,
                        left: mousePosition.x + 10,
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 100,
                        fontWeight: 'bold',
                        color: '#333'
                    }}
                >
                    {tooltipContent}
                </div>
            )}
        </div>
    );
};

export default IndiaMap;
