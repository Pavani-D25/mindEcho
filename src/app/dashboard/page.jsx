"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MoodTracker from "@/components/mood/MoodTracker";
import MoodHistory from "@/components/mood/MoodHistory";
import UserMenu from "@/components/auth/UserMenu";
import MoodTrendChart from "@/components/mood/MoodTrendChart";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/ui/floating-nav";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={50}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>

        <FloatingNav className="z-50" />

        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex justify-end mb-8">
            <UserMenu />
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MoodTracker />
              </motion.div>

              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MoodTrendChart />
              </motion.div>
            </div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-1"
            >
              <MoodHistory />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}