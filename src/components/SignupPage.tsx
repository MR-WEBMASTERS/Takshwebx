mport React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase"; // adjust path if needed

type Props = {
  onSuccessRedirect?: string; // e.g. "/dashboard"
};

const toEmail = (username: string) => `${username.toLowerCase()}@taksh.local`;

const SignupPage: React.FC<Props> = ({ onSuccessRedirect = "/dashboard" }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim().toLowerCase();
    if (!trimmedUsername) {
      setError("Username is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // 1) username uniqueness check (doc id = username)
      const userDocRef = doc(db, "users", trimmedUsername);
      const existing = await getDoc(userDocRef);
      if (existing.exists()) {
        setError("Username already taken — choose another");
        setLoading(false);
        return;
      }

      // 2) create hidden-email and create auth user
      const email = toEmail(trimmedUsername);
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // note: we don't use credential.user.uid as doc id here; we use username doc id by design

      // 3) write Firestore user doc (role 'user' only)
      await setDoc(userDocRef, {
        username: trimmedUsername,
        role: "user",
        createdAt: serverTimestamp(),
      });

      // 4) redirect / success
      window.location.href = onSuccessRedirect;
    } catch (err: any) {
      console.error("Signup error:", err);
      // user-friendly messages for common Firebase auth errors
      if (err.code === "auth/email-already-in-use") {
        setError("This username is already in use (try another).");
      } else if (err.code === "auth/invalid-password" || err.code === "auth/weak-password") {
        setError("Password is weak. Use 6+ characters.");
      } else {
        setError(err.message || "Failed to create an account. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-slate-800 rounded-lg text-slate-100">
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>

      {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

      <form onSubmit={handleSignup} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-300">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-slate-700 border border-slate-600"
            placeholder="choose a username"
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
            placeholder="password (min 6 chars)"
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300">Confirm password</label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-slate-700 border border-slate-600"
            type="password"
            placeholder="confirm password"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 mt-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-3 text-sm text-slate-400">
        Already have an account? <a href="/login" className="text-sky-300">Log in</a>
      </p>
    </div>
  );
};

export default SignupPage;
