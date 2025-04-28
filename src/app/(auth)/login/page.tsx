"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const { setToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await axios.post("/api/auth/login", { email, password });

      if (resp?.data?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", resp.data.token);
        }
        setToken(resp.data.token);
        setLoading(false);
        router.push("/admin");
      }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="rounded-lg border-2 border-gray-300 bg-white p-6 shadow-md md:w-1/3 mx-4 ">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2"
          />
          {errorMessage && (
            <p className="mb-4 text-center text-sm text-red-500">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md py-2 text-white focus:outline-none focus:ring-2 focus:bg-[#f287b780] cursor-pointer ${
              loading
                ? "cursor-not-allowed bg-[#f287b780]"
                : "bg-[#f287b7] hover:bg-[#f287b780]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
