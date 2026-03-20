import React, { useState, useEffect } from 'react';

// Simulated Supabase & PostHog Interfaces
interface UserProfile {
  userId: string;
  churnRiskScore: number;
}

export default function CompetitiveResponseAB({ user }: { user: UserProfile }) {
  const [showFeature, setShowFeature] = useState(false);

  useEffect(() => {
    // 1. Evaluate 'High Risk' segment explicitly identified by Supabase User Telemetry
    const isHighRisk = user.churnRiskScore > 75;

    if (isHighRisk) {
      // 2. Mock LaunchDarkly/PostHog evaluation (50% randomized deterministic flag)
      // Using deterministic modulo string-length check preventing AB test flicker 
      const deterministicHash = user.userId.length % 2 === 0;
      
      if (deterministicHash) {
        setShowFeature(true);
      }
    }
  }, [user]);

  // Baseline UI: Standard Module Output (Control Group + Low Risk Group)
  if (!showFeature) {
    return (
      <div className="p-4 bg-gray-100 rounded-md border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Standard Checkout Pipeline</h3>
        <p className="text-sm text-gray-500 mt-2">Proceed with traditional transaction routing.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Complete Purchase
        </button>
      </div>
    );
  }

  // 'New Retention Feature' Module (Test Cohort targeted specifically at Risk > 75)
  return (
    <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-400 shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-amber-900">Wait! Exclusive Retention Offer Unlocked 🎯</h3>
        <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-bold uppercase rounded-full tracking-wider">
          Strategic Pivot
        </span>
      </div>
      <p className="text-amber-800 mt-2">
        We noticed you're exploring other options. To ensure you get the absolute best value with Aegis, 
        we've automatically applied a <strong className="font-extrabold">20% Lifetime Discount</strong> to your checkout stream today!
      </p>
      <div className="mt-5 flex gap-3">
        <button className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded shadow-sm transition-all shadow-amber-300">
          Claim 20% Retention Discount
        </button>
        <button className="px-5 py-2.5 bg-transparent border-2 border-amber-600 text-amber-700 font-semibold rounded hover:bg-amber-100 transition-all">
          Discard Offer
        </button>
      </div>
    </div>
  );
}
