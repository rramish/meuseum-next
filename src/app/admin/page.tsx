"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import Loader from "@/components/Loader";
import { Uploadmodal } from "./components/Uploadmodal";
import { useImageStorage } from "@/store/imageStore";

interface Session {
  _id: string;
  name: string;
  imageUrl: string;
  imageName: string;
  status: string;
}

const Main = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activePiece, setActivePiece] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { setOriginalSessionImageURL } = useImageStorage();

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
      console.log("all sessions are : ", response.data.sessions);
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

  const handleActivateSession = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("No token found. Please log in.");
      }

      const resp = await axios.post(
        "/api/drawing-session/update",
        { sessionId: id, status: "active" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("resp is : ", resp);
      await fetchSessions();
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(
        error?.response?.data?.error ||
          "Failed to update session. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (previewUrl: string, imgLink: string) => {
    console.log("link is : ", imgLink);
    setOriginalSessionImageURL(imgLink);
    router.push(`admin/session/${previewUrl}`);
  };

  return (
    <div className="mx-4 max-w-full bg-white pb-2">
      <Header
        logout
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
                <p>No Session Found Please Create A Session</p>
              </div>
            ) : (
              <div className="w-full mx-auto overflow-auto px-10 py-2">
                <h2 className="text-gray-500 text-lg font-bold mb-4 text-center">
                  All Sessions
                </h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-gray-400 flex flex-1 w-full">
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate flex-[2]">
                        Image
                      </th>
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate flex-[2]">
                        Session ID
                      </th>
                      <th className="px-4 py-2 text-left border-b border-gray-100 truncate flex-1">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session._id}
                        className="hover:bg-gray-50 border-b border-gray-100 flex"
                      >
                        <td className="px-4 py-2 gap-4 flex items-center text-gray-500 truncate flex-[2]">
                          <img
                            alt="Original"
                            src={session?.imageUrl}
                            onClick={() => {
                              setActivePiece(session?.imageUrl);
                              setShowPreviewModal(true);
                            }}
                            className="w-16 h-16 object-cover cursor-pointer rounded-md"
                          />
                          <p>
                            {session.imageName.split(".")[0]}.
                            {session.imageName.split(".")[1]}
                          </p>
                        </td>
                        <td className="px-4 py-2 text-gray-500 truncate flex-[2] flex items-center">
                          <p>{session._id}</p>
                        </td>
                        <td className="px-4 py-2 flex gap-2 flex-1 items-center">
                          <div>
                            <p
                              onClick={() =>
                                handlePreview(session._id, session.imageUrl)
                              }
                              className="bg-[#f287b7] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#f287b780] cursor-pointer"
                            >
                              View
                            </p>
                          </div>
                          {session?.status == "inactive" && (
                            <div>
                              <p
                                onClick={() =>
                                  handleActivateSession(session._id)
                                }
                                className="bg-[#f287b7] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#f287b780] cursor-pointer"
                              >
                                Activate
                              </p>
                            </div>
                          )}
                          {session?.status == "active" && (
                            <div>
                              <p className="bg-[#f287b780] text-white font-bold px-4 py-2 rounded-xl">
                                Active
                              </p>
                            </div>
                          )}
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

        {showPreviewModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-100 p-3"
            onClick={() => {
              setActivePiece("");
              setShowPreviewModal(false);
            }}
          >
            <div
              className="bg-white relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePiece || ""}
                alt="Preview"
                width={500}
                height={500}
                style={{ objectFit: "contain" }}
              />
              <button
                className="absolute cursor-pointer top-0 right-0 text-[#F287B7] flex items-center justify-center bg-gray-200/90 rounded-full h-8 w-8 hover:bg-gray-300/50 font-extrabold"
                onClick={() => {
                  setActivePiece("");
                  setShowPreviewModal(false);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
