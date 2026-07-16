"use client";

import { useState } from "react";

export default function AquariumCalculator() {
  const [activeTab, setActiveTab] = useState<"volume" | "co2">("volume");

  // Volume States
  const [length, setLength] = useState<number>(60);
  const [width, setWidth] = useState<number>(30);
  const [height, setHeight] = useState<number>(36);

  // CO2 States
  const [tankLiters, setTankLiters] = useState<number>(60);
  const [lightLevel, setLightLevel] = useState<"low" | "medium" | "high">("medium");

  // Volume calculations
  const liters = (length * width * height) / 1000;
  const gallons = liters * 0.264172;
  const substrateKg = (length * width * 5 * 1.3) / 1000; // 5cm avg depth, 1.3 density
  const totalWeightKg = liters + substrateKg + (liters * 0.15); // water + substrate + glass weight

  // CO2 calculations (Bubbles Per Minute target estimate)
  const calculateBPM = () => {
    let base = tankLiters * 0.5; // ~30 bpm for 60L
    if (lightLevel === "low") base *= 0.6;
    if (lightLevel === "high") base *= 1.5;
    return Math.round(base);
  };

  return (
    <div className="box">
      <div 
        className="box-header" 
        style={{ 
          backgroundColor: 'var(--header-secondary)', 
          padding: '0', 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)' 
        }}
      >
        <button 
          onClick={() => setActiveTab("volume")}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === "volume" ? 'transparent' : 'rgba(0,0,0,0.2)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === "volume" ? 'bold' : 'normal',
            borderBottom: activeTab === "volume" ? '3px solid var(--brand-orange)' : 'none'
          }}
        >
          📏 Volume Calc
        </button>
        <button 
          onClick={() => setActiveTab("co2")}
          style={{
            flex: 1,
            padding: '12px',
            background: activeTab === "co2" ? 'transparent' : 'rgba(0,0,0,0.2)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === "co2" ? 'bold' : 'normal',
            borderBottom: activeTab === "co2" ? '3px solid var(--brand-orange)' : 'none'
          }}
        >
          🫧 CO2 Advisor
        </button>
      </div>

      <div className="box-content">
        {activeTab === "volume" ? (
          <div className="calculator-widget">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div className="calc-input-group">
                <label>Length (cm)</label>
                <input 
                  type="number" 
                  value={length} 
                  onChange={(e) => setLength(Number(e.target.value))} 
                />
              </div>
              <div className="calc-input-group">
                <label>Width (cm)</label>
                <input 
                  type="number" 
                  value={width} 
                  onChange={(e) => setWidth(Number(e.target.value))} 
                />
              </div>
              <div className="calc-input-group">
                <label>Height (cm)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="calc-result">
              <div>💧 <strong>Volume:</strong> {liters.toFixed(1)} L ({gallons.toFixed(1)} US gal)</div>
              <div>🌱 <strong>Substrate (approx):</strong> {substrateKg.toFixed(1)} kg soil</div>
              <div>⚖️ <strong>Filled Weight (est):</strong> {totalWeightKg.toFixed(1)} kg</div>
            </div>
          </div>
        ) : (
          <div className="calculator-widget">
            <div className="calc-input-group">
              <label>Tank Size (Liters)</label>
              <input 
                type="number" 
                value={tankLiters} 
                onChange={(e) => setTankLiters(Number(e.target.value))} 
              />
            </div>
            <div className="calc-input-group">
              <label>Lighting Level</label>
              <select 
                value={lightLevel} 
                onChange={(e) => setLightLevel(e.target.value as any)}
              >
                <option value="low">Low (shaded / slow growth)</option>
                <option value="medium">Medium (typical planted)</option>
                <option value="high">High (demanding carpets)</option>
              </select>
            </div>

            <div className="calc-result">
              <div>🎯 <strong>Target Bubble Rate:</strong> {calculateBPM()} BPM</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                *Rough estimate. Monitor drop checker colors closely!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
