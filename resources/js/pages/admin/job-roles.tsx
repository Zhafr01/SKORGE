import { motion } from 'framer-motion';
import { Search, Trash2, Edit2, Plus, X, Check, ArrowLeft, Briefcase, Eye, Link as LinkIcon } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';

interface Course {
    id: number;
    title: string;
}

interface JobRole {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    courses_count?: number;
    courses?: Course[];
    created_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export default function AdminJobRoles() {
    const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // Modal Context
    const [modal, setModal] = useState<{ show: boolean, role: JobRole | null, isLoadingDetails: boolean }>({ show: false, role: null, isLoadingDetails: false });
    const [formData, setFormData] = useState({ name: '', description: '', icon: '', category: '', courses_sync: [] as number[] });
    const [courseSearch, setCourseSearch] = useState('');
    
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchRoles = useCallback(() => {
        setLoading(true);
        api.get('/admin/job-roles', { params: { search, page } })
            .then((res) => {
                setJobRoles(res.data.data ?? []);
                setPagination({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                    total: res.data.total,
                    per_page: res.data.per_page,
                });
            })
            .finally(() => setLoading(false));
    }, [search, page]);

    useEffect(() => {
        api.get('/courses').then(res => setAllCourses(res.data.data ?? []));
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchRoles, 300);
        return () => clearTimeout(t);
    }, [fetchRoles]);

    const openModal = async (role?: JobRole) => {
        if (role) {
            setModal({ show: true, role, isLoadingDetails: true });
            setFormData({ name: role.name, description: role.description || '', icon: role.icon || '', category: role.category, courses_sync: [] });
            setCourseSearch('');
            
            try {
                // Fetch full role details to get connected courses
                const res = await api.get(`/admin/job-roles/${role.id}`);
                const fullRole = res.data.data;
                const assignedIds = fullRole.courses?.map((c: Course) => c.id) || [];
                setFormData(prev => ({ ...prev, courses_sync: assignedIds }));
            } catch (e) {
                showToast("Failed to load role details", "error");
            } finally {
                setModal(prev => ({ ...prev, isLoadingDetails: false }));
            }

        } else {
            setCourseSearch('');
            setFormData({ name: '', description: '', icon: '', category: '', courses_sync: [] });
            setModal({ show: true, role: null, isLoadingDetails: false });
        }
    };

    const toggleCourse = (courseId: number) => {
        setFormData(prev => ({
            ...prev,
            courses_sync: prev.courses_sync.includes(courseId) 
                ? prev.courses_sync.filter(id => id !== courseId)
                : [...prev.courses_sync, courseId]
        }));
    };

    const saveRole = async () => {
        setSaving(true);
        try {
            if (modal.role) {
                await api.put(`/admin/job-roles/${modal.role.id}`, formData);
                showToast('Job role updated successfully.');
            } else {
                await api.post('/admin/job-roles', formData);
                showToast('Job role created successfully.');
            }
            fetchRoles();
            setModal({ show: false, role: null, isLoadingDetails: false });
        } catch (e: any) {
            showToast(e.response?.data?.message || 'Failed to save job role.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const deleteRole = async (id: number) => {
        try {
            await api.delete(`/admin/job-roles/${id}`);
            fetchRoles();
            setDeleteConfirm(null);
            showToast('Job role deleted.');
        } catch {
            showToast('Failed to delete job role.', 'error');
        }
    };

    return (
        <AppLayout title="Job Roles Management" description="Manage learning paths and associated job categories">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px]" />
                <div className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-[120px]" />
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-bold text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-all hover:scale-105 shadow-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
                </Link>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Create New Role
                </button>
            </div>
            
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl shadow-2xl shadow-black/20 font-semibold text-sm flex items-center gap-3 transition-all ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {toast.type === 'success' ? <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-3 h-3" /></div> : <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><X className="w-3 h-3" /></div>}
                    {toast.msg}
                </div>
            )}

            {/* Create/Edit Modal */}
            {modal.show && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] w-full max-w-2xl border border-white/20 dark:border-white/10 p-8 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                {modal.role ? 'Edit Career Path' : 'Create New Career Path'}
                            </h3>
                            <button onClick={() => setModal({ show: false, role: null, isLoadingDetails: false })} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {modal.isLoadingDetails ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                                <p className="text-slate-500 font-medium animate-pulse">Loading connected courses...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                                            value={formData.name}
                                            placeholder="e.g. Frontend Developer"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                                            value={formData.category}
                                            placeholder="e.g. Engineering"
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Icon Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                                            value={formData.icon}
                                            placeholder="e.g. code"
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-colors h-32 resize-none"
                                            value={formData.description}
                                            placeholder="Brief description of this career path..."
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <LinkIcon className="w-4 h-4 text-amber-500" />
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Assign Courses</label>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 mb-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="Search courses to assign..."
                                        value={courseSearch}
                                        onChange={(e) => setCourseSearch(e.target.value)}
                                    />
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 h-[350px] overflow-y-auto space-y-2">
                                        {allCourses.length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-10">No courses available in platform.</p>
                                        ) : allCourses.filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase())).length === 0 ? (
                                            <p className="text-sm text-slate-500 text-center py-10">No matching courses found.</p>
                                        ) : (
                                            allCourses.filter(c => c.title.toLowerCase().includes(courseSearch.toLowerCase())).map(course => (
                                                <label key={course.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                                                    <input 
                                                        type="checkbox" 
                                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500 dark:bg-slate-900 dark:border-slate-600"
                                                        checked={formData.courses_sync.includes(course.id)}
                                                        onChange={() => toggleCourse(course.id)}
                                                    />
                                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                                                        {course.title}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selected: <span className="font-bold text-amber-500">{formData.courses_sync.length}</span> courses</p>
                                </div>
                            </div>
                        )}

                        {!modal.isLoadingDetails && (
                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                <button
                                    onClick={saveRole}
                                    disabled={saving || !formData.name || !formData.category}
                                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black uppercase tracking-wider text-sm transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                >
                                    {saving ? 'Saving Changes...' : 'Save Job Role'}
                                </button>
                                <button
                                    onClick={() => setModal({ show: false, role: null, isLoadingDetails: false })}
                                    className="px-8 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            , document.body)}

            {/* Delete Confirm Modal */}
            {deleteConfirm !== null && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 p-8 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_rgba(225,29,72,0.2)]">
                            <Trash2 className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Delete Career Path?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">This action will delete the path. Associated courses might be affected or orphaned.</p>
                        <div className="flex gap-3">
                            <button onClick={() => deleteRole(deleteConfirm)} className="flex-1 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition-colors shadow-lg shadow-rose-500/20 hover:-translate-y-0.5">
                                Delete
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            , document.body)}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all"
                        placeholder="Search career paths or courses..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

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
                            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Role Name</th>
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Category</th>
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Courses</th>
                                <th className="text-right px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-5" colSpan={4}>
                                            <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : jobRoles.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">No job roles found.</td>
                                </tr>
                            ) : (
                                jobRoles.map((role) => (
                                    <tr key={role.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-800 dark:text-white mb-0.5">{role.name}</p>
                                                    <p className="text-slate-400 text-xs w-48 md:w-64 lg:w-96 truncate font-medium">{role.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                                {role.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-black text-amber-500 text-base">{role.courses_count ?? 0} <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Courses</span></td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                <Link
                                                    to={`/job-roles/${role.id}`}
                                                    target="_blank"
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 transition-colors"
                                                    title="View Public Page"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => openModal(role)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-500 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400 transition-colors"
                                                    title="Edit Data & Courses"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(role.id)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                                                    title="Delete Path"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-8 py-5 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                        <p className="text-sm font-semibold text-slate-400">Page {pagination.current_page} of {pagination.last_page}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pagination.current_page === 1} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:hidden text-sm font-bold shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Previous</button>
                            <button onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))} disabled={pagination.current_page === pagination.last_page} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:hidden text-sm font-bold shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Next Page</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </AppLayout>
    );
}
