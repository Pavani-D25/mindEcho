"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Icons } from "@/components/icons";

export default function Home() {
  const { theme } = useTheme();

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-50 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-[length:40px_40px] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg rounded-2xl backdrop-blur-xl border border-purple-200 bg-white/60 shadow-2xl p-8 space-y-6 text-center"
      >
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-3">
          <Icons.logo className="h-14 w-14 text-purple-500" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
            MindEcho
          </h1>
          <p className="text-sm text-gray-600">
            Cultivate your mind with daily wellness & AI insights
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <Button
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 shadow-md text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-purple-400 text-purple-600 hover:bg-purple-100"
            >
              Create Account
            </Button>
          </Link>
        </div>

        {/* Divider */}
        {/* <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-purple-200" />
        </div> */}

        {/* Social Icons */}
        {/* <div className="flex justify-center gap-4">
          <Button variant="outline" size="icon" className="hover:bg-purple-100 rounded-full">
            <Icons.google className="h-5 w-5 text-purple-600" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-purple-100 rounded-full">
            <Icons.github className="h-5 w-5 text-purple-600" />
          </Button>
          <Button variant="outline" size="icon" className="hover:bg-purple-100 rounded-full">
            <Icons.twitter className="h-5 w-5 text-purple-600" />
          </Button>
        </div> */}

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-500 mt-2"
        >
          By continuing, you agree to our Terms & Privacy.
        </motion.p>
      </motion.div>
    </main>
  );
}
