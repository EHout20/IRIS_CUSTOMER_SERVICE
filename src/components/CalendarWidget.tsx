'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function CalendarWidget() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    // Use same-origin server proxy to avoid exposing tokens and CORS issues
    fetch('/api/calendar')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok) {
            console.error('Calendar API error:', data);
            return { items: [] };
          }
          return data;
        }
        // If we get non-JSON (unexpected), convert to text and surface as an error
        const text = await res.text();
        console.error('Calendar API returned non-JSON response:', text);
        return { items: [] };
      })
      .then((data) => setEvents(data.items || []))
      .catch((err) => console.error('Calendar fetch error:', err));
  }, [session]);

  if (!session) {
    return (
      <div className="absolute top-4 left-4 max-w-sm">
        <button
          className="w-full px-4 py-2 border-2 border-white text-white font-semibold rounded-md transition duration-200 ease-in-out hover:bg-white hover:text-black hover:shadow-[0_0_15px_4px_rgba(255,255,255,0.6)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => signIn("google", { callbackUrl: '/calendar' })}
        >
          Sign into Google to access Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 w-96 h-80 border border-gray-300 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white">Your Google Calendar</h3>
        <button
          className="text-sm text-red-400 hover:underline"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="border-b pb-2">
            <strong className="text-white">{event.summary}</strong>
            <br />
            <span className="text-sm text-gray-300">
              {event.start?.dateTime || event.start?.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}