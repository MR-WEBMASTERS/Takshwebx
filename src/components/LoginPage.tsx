import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // adjust path if needed

type Props = {
  onSuccessRedirectUser?: string; // default user dashboard
  onSuccessRedirectAdmin?: string; // admin dashboard
};

const toEmail = (username: string) => `${username.toLowerCase()}@taksh.local`;

const LoginPage: React.FC<Props> = ({
  onSuccessRedirectUser = "/dashboard",
  onSuccessRedirectAdmin = "/admin",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setError("Enter your username");
      return;
    }
    if (!password) {
      setError("Enter your password");
      return;
    }

    setLoading(true);
    try {
      const email = toEmail(trimmed);
      await signInWithEmailAndPassword(auth, email, password);

      // Look up user doc (doc id = username)
      const userDocRef = doc(db, "users", trimmed);
      const userSnap = await getDoc(userDocRef);

      const role = userSnap.exists() ? (userSnap.data() as any).role : null;

      if (role === "admin") {
        window.location.href = onSuccessRedirectAdmin;
      } else {
        window.location.href = onSuccessRedirectUser;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid username or password");
      } else {
        setError(err.message || "Failed to sign in. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-slate-800 rounded-lg text-slate-100">
      <h2 className="text-xl font-semibold mb-4">Log in</h2>

      {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-300">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-slate-700 border border-slate-600"
            placeholder="your username"
            autoComplete="username"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-slate-700 border border-slate-600"
            type="password"
            placeholder="password"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-400">
        New here? <a href="/signup" className="text-emerald-300">Create an account</a>
      </p>
    </div>
  );
};

export default LoginPage;
