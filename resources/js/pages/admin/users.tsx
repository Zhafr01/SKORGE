import { motion } from 'framer-motion';
import { Search, Trash2, Edit2, ShieldCheck, ShieldOff, X, Check, ChevronLeft, ChevronRight, User, ArrowLeft } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    xp_points: number;
    current_streak: number;
    created_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface EditModal {
    user: UserRow | null;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export default function AdminUsers() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserRow[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState<EditModal>({ user: null, name: '', email: '', role: 'user' });
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUsers = useCallback(() => {
        setLoading(true);
        api.get('/admin/users', { params: { search, role: roleFilter, page } })
            .then((res) => {
                setUsers(res.data.data ?? []);
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                    total: res.data.total,
                    per_page: res.data.per_page,
                });
            })
            .finally(() => setLoading(false));
    }, [search, roleFilter, page]);

    useEffect(() => {
        const t = setTimeout(fetchUsers, 300);

        return () => clearTimeout(t);
    }, [fetchUsers]);

    const openEdit = (u: UserRow) => {
        setEditModal({ user: u, name: u.name, email: u.email, role: u.role });
    };

    const saveEdit = async () => {
        if (!editModal.user) {
return;
}

        setSaving(true);

        try {
            const res = await api.put(`/admin/users/${editModal.user.id}`, {
                name: editModal.name,
                email: editModal.email,
                role: editModal.role,
            });
            setUsers((prev) => prev.map((u) => (u.id === editModal.user!.id ? { ...u, ...res.data.data } : u)));
            setEditModal({ user: null, name: '', email: '', role: 'user' });
            showToast('User updated successfully.');
        } catch {
            showToast('Failed to update user.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setDeleteConfirm(null);
            showToast('User deleted.');
        } catch {
            showToast('Failed to delete user.', 'error');
        }
    };

    return (
        <AppLayout title="User Management" description="View, edit roles and manage all platform users">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-[120px]" />
            </div>

            {/* Back to Admin Panel */}
            <div className="mb-6">
                <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-bold text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all hover:scale-105 shadow-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Admin Panel
                </Link>
            </div>
            
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl shadow-black/20 font-semibold text-sm flex items-center gap-3 transition-all ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {toast.type === 'success' ? <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-3 h-3" /></div> : <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3 h-3" /></div>}
                    {toast.msg}
                </div>
            )}

            {/* Edit Modal */}
            {editModal.user && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Edit User</h3>
                            <button onClick={() => setEditModal({ user: null, name: '', email: '', role: 'user' })} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                <input
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    value={editModal.name}
                                    onChange={(e) => setEditModal((p) => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    value={editModal.email}
                                    onChange={(e) => setEditModal((p) => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    value={editModal.role}
                                    onChange={(e) => setEditModal((p) => ({ ...p, role: e.target.value as 'user' | 'admin' }))}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={saveEdit}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setEditModal({ user: null, name: '', email: '', role: 'user' })}
                                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}

            {/* Delete Confirm Modal */}
            {deleteConfirm !== null && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete User?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action is permanent and cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => deleteUser(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors">
                                Delete
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
 setSearch(e.target.value); setPage(1); 
}}
                    />
                </div>
                <select
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={roleFilter}
                    onChange={(e) => {
 setRoleFilter(e.target.value); setPage(1); 
}}
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Stats pill */}
            {pagination && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{pagination.total} users found</p>
            )}

            {/* Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/20 dark:shadow-none"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">User</th>
                                <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Role</th>
                                <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">XP</th>
                                <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Streak</th>
                                <th className="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Joined</th>
                                <th className="text-right px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4" colSpan={6}>
                                            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No users found.</td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{u.name}</p>
                                                    <p className="text-slate-400 text-xs">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                u.role === 'admin'
                                                    ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    : 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                                            }`}>
                                                {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-amber-500">{u.xp_points?.toLocaleString?.()}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.current_streak ?? 0}d</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(u)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(u.id)}
                                                    disabled={u.id === currentUser?.id}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={u.id === currentUser?.id ? "Cannot delete yourself" : "Delete"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-400">
                            Page {pagination.current_page} of {pagination.last_page}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={pagination.current_page === 1}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
