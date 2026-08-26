"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ArrowLeft, Shield, ShieldCheck, User, Search, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async () => {
    if (!selectedUser) return;
    const nextRole = selectedUser.role === "ADMIN" ? "USER" : "ADMIN";

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: nextRole,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update role");
      }

      await fetchUsers();
      setIsRoleModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cinema-black text-white selection:bg-brand selection:text-white pb-20">
      <Navbar />

      <main className="pt-24 sm:pt-28 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border/50 pb-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-cinema-muted hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              User Directory & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-cinema-muted mt-1">
              View registered members and manage administrator privileges.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : (
          <div className="rounded-2xl border border-cinema-border/60 bg-cinema-card overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-zinc-300">
                <thead className="bg-cinema-surface text-[11px] font-bold text-cinema-muted uppercase tracking-wider border-b border-cinema-border/50">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-4 py-4">Email</th>
                    <th className="px-4 py-4">Role</th>
                    <th className="px-4 py-4">Profiles</th>
                    <th className="px-4 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-border/40 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-cinema-surface/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-cinema-surface flex-shrink-0">
                          <Image
                            src={u.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                            alt={u.name || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-bold text-white">{u.name || "Anonymous"}</span>
                      </td>
                      <td className="px-4 py-4 text-zinc-400">{u.email}</td>
                      <td className="px-4 py-4">
                        <Badge variant={u.role === "ADMIN" ? "brand" : "outline"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">{u.profiles?.length || 1} profile(s)</td>
                      <td className="px-4 py-4 text-cinema-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant={u.role === "ADMIN" ? "outline" : "primary"}
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsRoleModalOpen(true);
                          }}
                        >
                          {u.role === "ADMIN" ? "Demote to User" : "Make Admin"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Role Toggle Confirmation Modal */}
      <ConfirmModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={handleToggleRole}
        title="Modify User Role?"
        description={`Are you sure you want to change ${selectedUser?.name}'s role to ${
          selectedUser?.role === "ADMIN" ? "USER" : "ADMIN"
        }?`}
        confirmText="Confirm Role Change"
        isLoading={isSubmitting}
      />
    </div>
  );
}
