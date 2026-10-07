"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function RealTimeUsers() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/analytics/realtime");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setActiveUsers(data.activeUsers);
        setError(null);
      } catch (err) {
        setError("Setup required");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="col-span-full mb-8 p-6 text-center border-purple-500/30 bg-purple-900/20">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-purple-200">Live Active Users</h2>
        </div>
        
        {loading ? (
          <div className="text-4xl font-bold text-white/50 animate-pulse">...</div>
        ) : error ? (
          <div className="text-sm text-red-300 mt-2">
            Configure GA4_PROPERTY_ID in Netlify env vars to activate
          </div>
        ) : (
          <div className="text-6xl font-serif font-bold text-white mt-2">
            {activeUsers}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
