"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Icons } from "@/components/icons";

export default function Home() {
  const { theme } = useTheme();

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        {theme === "dark" ? (
          <div className="absolute inset-0 opacity-20 bg-[url('/grid-dark.svg')] bg-[length:40px_40px]" />
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[url('/grid-light.svg')] bg-[length:40px_40px]" />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center w-full max-w-md gap-8 p-8 rounded-lg shadow-xl bg-background/80 backdrop-blur-sm border"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Icons.logo className="w-16 h-16" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MindBloom
          </h1>
          <p className="text-muted-foreground">
            Cultivate your knowledge, grow your mind
          </p>
        </div>

        <div className="flex flex-col w-full gap-4">
          <Link href="/auth/login" className="w-full">
            <Button size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center w-full gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Icons.google className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Icons.github className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Icons.twitter className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-4 text-sm text-muted-foreground"
      >
        By continuing, you agree to our Terms of Service
      </motion.div>
    </main>
  );
}