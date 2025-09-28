"use client";

import CalendarWidget from '@/components/CalendarWidget';

export default function CalendarPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Your Google Calendar</h1>
      <CalendarWidget />
    </main>
  );
}
