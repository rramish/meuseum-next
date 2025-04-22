"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import { Uploadmodal } from "./components/Uploadmodal";
import Loader from "@/components/Loader";

interface Session {
  _id: string;
  name: string;
  previewUrl: string;
  imageName: string;
}

const Main = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        return router.push("/login");
      } else {
        fetchSessions();
      }
    }
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("No token found. Please log in.");
      }

      const response = await axios.get("/api/drawing-session/allSessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(response.data.sessions);
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(
        error?.response?.data?.error ||
          "Failed to fetch sessions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (previewUrl: string) => {
    router.replace(`admin/session/${previewUrl}`);
  };

  return (
    <div className="mx-4 max-w-full bg-white pb-2">
      <Header
        onNewDrawing={() => {
          setShowModal(true);
        }}
      />

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : (
          <>
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
            {sessions && sessions.length <= 0 ? (
              <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                <p> No Session Found Please Create A Session</p>
              </div>
            ) : (
              <div className="w-full max-w-full overflow-auto">
                <h2 className="text-gray-500 text-lg font-bold mb-4">
                  All Sessions
                </h2>
                <table className="w-full max-w-full overflow-scroll">
                  <thead>
                    <tr className="text-gray-400 max-w-full">
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate overflow-hidden">
                        Image Name
                      </th>
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate overflow-hidden">
                        Session ID
                      </th>
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate overflow-hidden">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session._id}
                        className="hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td className="px-4 py-2 text-gray-500 truncate overflow-hidden">
                          {session.imageName || "Unnamed Session"}
                        </td>
                        <td className="px-4 py-2 text-gray-500 truncate overflow-hidden">
                          {session._id}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handlePreview(session._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <Uploadmodal
              onclose={() => {
                setShowModal(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
