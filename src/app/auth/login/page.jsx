// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { auth, provider, db } from "@/lib/firebase";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Icons } from "@/components/icons";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState({
//     email: false,
//     google: false
//   });

//   const loginWithEmail = async () => {
//     setIsLoading({ ...isLoading, email: true });
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.push("/dashboard");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsLoading({ ...isLoading, email: false });
//     }
//   };

//   const loginWithGoogle = async () => {
//     setIsLoading({ ...isLoading, google: true });
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       await setDoc(doc(db, "users", user.uid), {
//         email: user.email,
//         plan: "free",
//         role: "user",
//         createdAt: new Date(),
//         provider: "google"
//       }, { merge: true });
//       router.push("/dashboard");
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsLoading({ ...isLoading, google: false });
//     }
//   };

//   return (
//     <div className="container relative flex flex-col items-center justify-center min-h-screen p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-background border"
//       >
//         <div className="flex flex-col space-y-2 text-center">
//           <Icons.logo className="w-10 h-10 mx-auto" />
//           <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
//           <p className="text-sm text-muted-foreground">
//             Enter your email to sign in to your account
//           </p>
//         </div>

//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={isLoading.email}
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="••••••••"
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isLoading.email}
//             />
//           </div>
//           <div className="flex items-center justify-end">
//             <Link
//               href="/auth/reset-password"
//               className="text-sm font-medium underline underline-offset-4 hover:text-primary text-muted-foreground"
//             >
//               Forgot password?
//             </Link>
//           </div>
//           <Button
//             onClick={loginWithEmail}
//             disabled={isLoading.email || !email || !password}
//             className="mt-2"
//           >
//             {isLoading.email && (
//               <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
//             )}
//             Sign In with Email
//           </Button>
//         </div>

//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t" />
//           </div>
//           <div className="relative flex justify-center text-xs uppercase">
//             <span className="px-2 bg-background text-muted-foreground">
//               Or continue with
//             </span>
//           </div>
//         </div>

//         <Button
//           variant="outline"
//           onClick={loginWithGoogle}
//           disabled={isLoading.google}
//           className="w-full"
//         >
//           {isLoading.google ? (
//             <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
//           ) : (
//             <Icons.google className="w-4 h-4 mr-2" />
//           )}
//           Google
//         </Button>

//         <p className="px-8 text-sm text-center text-muted-foreground">
//           By clicking continue, you agree to our{" "}
//           <Link
//             href="/terms"
//             className="underline underline-offset-4 hover:text-primary"
//           >
//             Terms of Service
//           </Link>{" "}
//           and{" "}
//           <Link
//             href="/privacy"
//             className="underline underline-offset-4 hover:text-primary"
//           >
//             Privacy Policy
//           </Link>
//           .
//         </p>

//         <div className="text-sm text-center text-muted-foreground">
//           Don't have an account?{" "}
//           <Link
//             href="/auth/register"
//             className="font-medium underline underline-offset-4 hover:text-primary"
//           >
//             Sign up
//           </Link>
//         </div>
//       </motion.div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState({ email: false, google: false });

  const loginWithEmail = async () => {
    setIsLoading({ ...isLoading, email: true });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading({ ...isLoading, email: false });
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading({ ...isLoading, google: true });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        plan: "free",
        role: "user",
        createdAt: new Date(),
        provider: "google",
      }, { merge: true });
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading({ ...isLoading, google: false });
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-50 px-4">
      <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-[length:40px_40px] opacity-10 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md p-8 space-y-6 rounded-2xl backdrop-blur-xl bg-white/60 border border-purple-200 shadow-xl"
      >
        <div className="text-center space-y-2">
          <Icons.logo className="h-12 w-12 mx-auto text-purple-500" />
          <h1 className="text-3xl font-bold text-purple-700">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to continue to MindBloom</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading.email}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading.email}
            />
          </div>
          <div className="flex justify-end">
            <Link
              href="/auth/reset-password"
              className="text-sm text-purple-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            onClick={loginWithEmail}
            disabled={isLoading.email || !email || !password}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading.email && <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />}
            Sign In
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-purple-200" />
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-purple-200" />
        </div>

        <Button
          variant="outline"
          onClick={loginWithGoogle}
          disabled={isLoading.google}
          className="w-full border-purple-300"
        >
          {isLoading.google ? (
            <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Icons.google className="w-4 h-4 mr-2 text-purple-600" />
          )}
          Sign in with Google
        </Button>

        <p className="text-xs text-center text-gray-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-purple-600">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-purple-600">Privacy Policy</Link>.
        </p>

        <div className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-purple-600 hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
