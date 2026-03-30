import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CountdownTimer from '../components/countdown/CountdownTimer';
import StatsPanel from '../components/countdown/StatsPanel';
import FilterBar from '../components/countdown/FilterBar';
import DayGrid from '../components/countdown/DayGrid';
import BokehBackground from '../components/countdown/BokehBackground';
import ConceptSelector, { CONCEPTS } from '../components/countdown/ConceptSelector';
import MusicPlayer from '../components/countdown/MusicPlayer';

const TARGET_DATE = new Date(2026, 2, 24, 0, 0, 0);
const STORAGE_KEY = 'alma-despair-table-marked';
const CONCEPT_KEY = 'alma-concept';

const APP_START_DATE = new Date(2026, 2, 1, 0, 0, 0); // 1.3.2026

function generateDays() {
  const start = new Date(APP_START_DATE);
  start.setHours(0, 0, 0, 0);
  const end = new Date(TARGET_DATE);
  end.setHours(0, 0, 0, 0);
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export default function Home() {
  const [markedDays, setMarkedDays] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');
  const [activeConcept, setActiveConcept] = useState(() =>
    localStorage.getItem(CONCEPT_KEY) || 'neon-noir'
  );

  const concept = CONCEPTS[activeConcept];
  const days = useMemo(() => generateDays(), []);
  const isDone = new Date() >= TARGET_DATE;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = today.toISOString().split('T')[0];
  const isTodayMarked = markedDays.includes(todayKey);

  const pastDaysCount = days.filter(d => {
    const dd = new Date(d); dd.setHours(0,0,0,0);
    return dd <= today;
  }).length;

  const daysRemaining = days.filter(d => {
    const dd = new Date(d); dd.setHours(0,0,0,0);
    return dd > today;
  }).length;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markedDays));
  }, [markedDays]);

  useEffect(() => {
    localStorage.setItem(CONCEPT_KEY, activeConcept);
  }, [activeConcept]);

  const toggleDay = (dateKey) => {
    setMarkedDays(prev =>
      prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
    );
  };

  const markToday = () => {
    if (!isTodayMarked && !isDone) {
      setMarkedDays(prev => [...prev, todayKey]);
    }
  };

  const accent = concept.accent;
  const secondary = concept.secondary;

  return (
    <div className="min-h-screen relative" style={{ background: '#0B0B10', color: '#e0e0e0' }} dir="rtl">
      <BokehBackground accent={accent} />

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-10 sm:pt-14 pb-4 text-center px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-sm" style={{ color: accent }}>✦</span>
              <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Comeback Stage</span>
              <span className="text-sm" style={{ color: secondary }}>✦</span>
            </div>
            <h1
              className="font-poster text-5xl sm:text-6xl md:text-7xl mb-1"
              style={{
                color: accent,
                textShadow: `0 0 20px ${accent}66, 0 0 40px ${accent}33`,
                animation: 'neonPulse 2.5s ease-in-out infinite',
              }}
            >
              טבלת הייאוש
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 tracking-[0.2em] uppercase mt-1">
              עד יום ההולדת של אלמה · 24.03.2026
            </p>
          </motion.div>
        </header>

        <main className="max-w-3xl mx-auto px-4 pb-20 space-y-5 sm:space-y-7">
          {/* Timer Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
            style={{
              background: 'rgba(18,18,28,0.8)',
              border: `1px solid ${accent}33`,
              boxShadow: `0 0 30px ${accent}18`,
            }}
          >
            <CountdownTimer concept={concept} />
          </motion.section>

          {/* Concept Selector */}
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <ConceptSelector activeConcept={activeConcept} onChange={setActiveConcept} />
          </motion.section>

          {/* Music Player */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <MusicPlayer concept={concept} />
          </motion.section>

          {/* Stats */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <StatsPanel
              totalDays={days.length}
              markedCount={markedDays.length}
              pastDaysCount={pastDaysCount}
              daysRemaining={daysRemaining}
              concept={concept}
            />
          </motion.section>

          {/* Mark Today Button */}
          {!isDone && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
              <motion.button
                whileHover={!isTodayMarked ? { scale: 1.05 } : {}}
                whileTap={!isTodayMarked ? { scale: 0.95 } : {}}
                onClick={markToday}
                disabled={isTodayMarked}
                className="rounded-full px-7 py-3 font-medium text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-2 mx-auto"
                style={isTodayMarked ? {
                  background: '#1a1a2a',
                  color: '#555',
                  border: '1px solid #1e1e2e',
                  cursor: 'not-allowed',
                } : {
                  background: `linear-gradient(135deg, ${accent}, ${secondary})`,
                  color: '#0a0a0f',
                  fontWeight: 700,
                  boxShadow: `0 0 20px ${accent}44, 0 4px 20px ${accent}22`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                {isTodayMarked ? `✓ TODAY STAMPED` : `סמני את היום · STAMP`}
              </motion.button>
            </motion.div>
          )}

          {/* Filters */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <FilterBar activeFilter={filter} onFilterChange={setFilter} concept={concept} />
          </motion.section>

          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}44)` }} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-600">Tracklist</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
          </div>

          {/* Day Grid */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <DayGrid
              days={days}
              markedDays={markedDays}
              onToggleDay={toggleDay}
              filter={filter}
              isDone={isDone}
              concept={concept}
            />
          </motion.section>
        </main>

        <footer className="text-center py-8 text-gray-600 text-xs tracking-[0.3em]">
          ✦ for Alma 💜 ✦
        </footer>
      </div>
    </div>
  );
}
