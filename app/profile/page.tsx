"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleChangePassword = async () => {
    setMessage("");
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/changepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        setMessage("Password changed successfully!");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <h3>Change Password</h3>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleChangePassword}>
            Change Password
          </button>
          {message && <p className="mt-2">{message}</p>}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
