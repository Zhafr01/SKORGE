import { motion } from 'framer-motion';
import { Search, Trash2, Edit2, Plus, X, Check, ArrowLeft, BookOpen, Clock, Youtube, Link as LinkIcon, SortAsc } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/skorge/AppLayout';
import api from '@/lib/api';

interface JobRole { id: number; name: string; }

interface Course {
    id: number;
    title: string;
    description: string;
    field: string;
    level: string;
    duration_minutes: number;
    job_role_id: number;
    job_role?: JobRole;
}

interface Video {
    id: number;
    title: string;
    url: string;
    duration_seconds: number;
    order: number;
}

export default function AdminCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
    const [search, setSearch] = useState('');
    const [jobFilter, setJobFilter] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<any>(null);

    // Modals
    const [modal, setModal] = useState<{ show: boolean, course: Course | null }>({ show: false, course: null });
    const [formData, setFormData] = useState({ title: '', description: '', field: '', level: 'Beginner', duration_minutes: 0, job_role_id: '' });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    
    // Video Management System
    const [videoModal, setVideoModal] = useState<{ show: boolean, course: Course | null }>({ show: false, course: null });
    const [videos, setVideos] = useState<Video[]>([]);
    const [vLoading, setVLoading] = useState(false);
    const [vForm, setVForm] = useState<{ id?: number, title: string, url: string, duration_seconds: number, order: number }>({ title: '', url: '', duration_seconds: 0, order: 1 });

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [vDeleteConfirm, setVDeleteConfirm] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchCourses = useCallback(() => {
        setLoading(true);
        api.get('/admin/courses', { params: { search, job_role_id: jobFilter, page } })
            .then(res => {
                setCourses(res.data.data ?? []);
                setPagination(res.data);
            })
            .finally(() => setLoading(false));
    }, [search, jobFilter, page]);

    useEffect(() => {
        api.get('/admin/job-roles', { params: { per_page: 500 } }).then(res => setJobRoles(res.data.data ?? []));
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchCourses, 300);
        return () => clearTimeout(t);
    }, [fetchCourses]);

    // ---- COURSE CRUD ----
    const openModal = (course?: Course) => {
        if (course) {
            setFormData({ title: course.title, description: course.description || '', field: course.field || '', level: course.level, duration_minutes: course.duration_minutes, job_role_id: String(course.job_role_id) });
        } else {
            setFormData({ title: '', description: '', field: '', level: 'Beginner', duration_minutes: 60, job_role_id: jobRoles[0]?.id.toString() || '' });
        }
        setThumbnailFile(null);
        setModal({ show: true, course: course || null });
    };

    const saveCourse = async () => {
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('description', formData.description);
            fd.append('field', formData.field);
            fd.append('level', formData.level);
            fd.append('duration_minutes', String(formData.duration_minutes));
            fd.append('job_role_id', formData.job_role_id);
            if (thumbnailFile) {
                fd.append('thumbnail', thumbnailFile);
            }

            const config = { headers: { 'Content-Type': undefined as any } };

            if (modal.course) {
                await api.post(`/admin/courses/${modal.course.id}`, fd, config);
            } else {
                await api.post('/admin/courses', fd, config);
            }
            showToast(modal.course ? 'Course updated.' : 'Course created.');
            fetchCourses();
            setModal({ show: false, course: null });
        } catch (e: any) {
            showToast(e.response?.data?.message || 'Failed to save.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const deleteCourse = async (id: number) => {
        try {
            await api.delete(`/admin/courses/${id}`);
            fetchCourses();
            setDeleteConfirm(null);
            showToast('Course deleted.');
        } catch { showToast('Failed to delete.', 'error'); }
    };

    // ---- VIDEO CRUD ----
    const openVideoModal = async (course: Course) => {
        setVideoModal({ show: true, course });
        setVLoading(true);
        try {
            const res = await api.get(`/admin/courses/${course.id}/videos`);
            const loadedVideos = res.data;
            setVideos(loadedVideos);
            setVForm({ title: '', url: '', duration_seconds: 600, order: loadedVideos.length + 1 });
        } catch {
            showToast('Failed to load videos.', 'error');
        } finally {
            setVLoading(false);
        }
    };

    const loadVideos = async (courseId: number) => {
        const res = await api.get(`/admin/courses/${courseId}/videos`);
        setVideos(res.data);
        setVForm({ title: '', url: '', duration_seconds: 600, order: res.data.length + 1 });
    }

    const saveVideo = async () => {
        if(!videoModal.course) return;
        setSaving(true);
        try {
            if (vForm.id) {
                await api.put(`/admin/courses/${videoModal.course.id}/videos/${vForm.id}`, vForm);
                showToast('Video updated.');
            } else {
                await api.post(`/admin/courses/${videoModal.course.id}/videos`, vForm);
                showToast('Video added to course.');
            }
            await loadVideos(videoModal.course.id);
        } catch (e: any) {
            showToast(e.response?.data?.message || 'Failed to save video.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const editVideo = (v: Video) => {
        setVForm({ id: v.id, title: v.title, url: v.url, duration_seconds: v.duration_seconds, order: v.order });
    };

    const deleteVideo = async (id: number) => {
        if(!videoModal.course) return;
        try {
            await api.delete(`/admin/courses/${videoModal.course.id}/videos/${id}`);
            await loadVideos(videoModal.course.id);
            setVDeleteConfirm(null);
            showToast('Video deleted.');
        } catch { showToast('Failed to delete video.', 'error'); }
    };

    return (
        <AppLayout title="Course Engine" description="Manage learning content and video modules">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute top-[10%] -left-[10%] w-[40%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px]" />
                <div className="absolute -bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px]" />
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <Link to="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-sm font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-all hover:scale-105 shadow-sm">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
                </Link>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                    <Plus className="w-4 h-4" /> Add New Course
                </button>
            </div>

            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl shadow-black/20 font-semibold text-sm flex items-center gap-3 transition-all ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">{toast.type === 'success' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}</div>
                    {toast.msg}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    className="px-4 py-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    value={jobFilter}
                    onChange={(e) => { setJobFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Career Paths</option>
                    {jobRoles.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
            </div>

            {/* Course Table */}
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
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Course Title</th>
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Job Role (Path)</th>
                                <th className="text-left px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Details</th>
                                <th className="text-right px-6 py-5 font-bold text-slate-500 uppercase tracking-widest text-[11px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td className="px-6 py-5" colSpan={4}><div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" /></td></tr>
                                ))
                            ) : courses.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">No courses found.</td></tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                    <BookOpen className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-800 dark:text-white mb-0.5">{course.title}</p>
                                                    <p className="text-slate-400 text-xs w-48 md:w-64 truncate font-medium">{course.description || 'No description'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                {course.job_role?.name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-black uppercase tracking-wider ${course.level === 'Beginner' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : course.level === 'Advanced' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-orange-50 border-orange-200 text-orange-600'} dark:bg-transparent dark:border-slate-700`}>{course.level}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{course.duration_minutes}m</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2 text-slate-400">
                                                <button onClick={() => openVideoModal(course)} className="flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs transition-colors shadow-sm">
                                                    <Youtube className="w-4 h-4" /> Manage Videos
                                                </button>
                                                <button onClick={() => openModal(course)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-500 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-400 transition-colors" title="Edit Course"><Edit2 className="w-5 h-5" /></button>
                                                <button onClick={() => setDeleteConfirm(course.id)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors" title="Delete Course"><Trash2 className="w-5 h-5" /></button>
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
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:hidden text-sm font-bold shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Prev</button>
                            <button onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))} disabled={page === pagination.last_page} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:hidden text-sm font-bold shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Course Create/Edit Modal */}
            {modal.show && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200/50 dark:border-white/10 p-8 max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                                {modal.course ? 'Edit Course Details' : 'Create New Course'}
                            </h3>
                            <button onClick={() => setModal({ show: false, course: null })} className="text-slate-400 hover:text-slate-800 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Course Title</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                            <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Associated Job Role</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500" value={formData.job_role_id} onChange={e => setFormData({...formData, job_role_id: e.target.value})}>
                                {jobRoles.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
                            </select></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Level</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                                    <option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                                </select></div>
                                <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration (mins)</label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: Number(e.target.value)})} /></div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Course Photo (Optional)</label>
                                <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-slate-200 dark:file:border-slate-700 file:text-sm file:font-semibold file:bg-white dark:file:bg-slate-800 file:text-slate-700 dark:file:text-white hover:file:bg-slate-50 dark:hover:file:bg-slate-700 cursor-pointer text-slate-500" />
                            </div>
                            <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={saveCourse} disabled={saving} className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm tracking-wider shadow-lg shadow-emerald-500/20">{saving ? 'Saving...' : 'Save Course'}</button>
                        </div>
                    </motion.div>
                </div>
            , document.body)}

            {/* Manage Videos Modal */}
            {videoModal.show && videoModal.course && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_-15px_rgba(16,185,129,0.3)] w-full max-w-4xl border border-emerald-500/20 p-0 flex flex-col md:flex-row h-[85vh] overflow-hidden"
                    >
                        {/* Video Form Sidebar */}
                        <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                            <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-emerald-500" /> {vForm.id ? 'Edit Video' : 'Add New Video'}
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1 uppercase tracking-wider">Video Title</label>
                                    <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white" placeholder="e.g. Introduction to React" value={vForm.title} onChange={e => setVForm({...vForm, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1 uppercase tracking-wider">YouTube URL</label>
                                    <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white" placeholder="https://youtube.com/watch?v=..." value={vForm.url} onChange={e => setVForm({...vForm, url: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1 uppercase tracking-wider">Duration (s)</label>
                                        <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white" value={vForm.duration_seconds} onChange={e => setVForm({...vForm, duration_seconds: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1 uppercase tracking-wider">Order</label>
                                        <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white" value={vForm.order} onChange={e => setVForm({...vForm, order: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div className="pt-4 flex flex-col gap-2">
                                    <button onClick={saveVideo} disabled={saving || !vForm.title || !vForm.url} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50">
                                        {saving ? 'Saving...' : vForm.id ? 'Update Video' : 'Add to Course'}
                                    </button>
                                    {vForm.id && (
                                        <button onClick={() => setVForm({ title: '', url: '', duration_seconds: 600, order: videos.length + 1 })} className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold text-sm transition-all">Cancel Edit</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Videos List */}
                        <div className="flex-1 bg-white dark:bg-transparent flex flex-col h-full overflow-hidden">
                            <div className="p-6 md:p-8 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">Manage Videos</h3>
                                    <p className="text-sm font-semibold text-emerald-500">Course: {videoModal.course.title}</p>
                                </div>
                                <button onClick={() => setVideoModal({ show: false, course: null })} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 md:p-8 overflow-y-auto flex-1">
                                {vLoading ? (
                                    <div className="py-20 flex flex-col items-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                                ) : videos.length === 0 ? (
                                    <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                                        <Youtube className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                        <p className="text-slate-500 font-semibold mb-1">No videos added yet</p>
                                        <p className="text-xs text-slate-400">Use the form to add the first video module.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {videos.map((v, idx) => (
                                            <div key={v.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 shrink-0">
                                                    {v.order}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-slate-800 dark:text-white truncate">{v.title}</p>
                                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-1 truncate">
                                                        <Clock className="w-3 h-3 text-emerald-500" /> {Math.floor(v.duration_seconds/60)}m {v.duration_seconds%60}s
                                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                                        <LinkIcon className="w-3 h-3 text-cyan-500" /> {v.url}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={() => editVideo(v)} className="p-2.5 rounded-lg text-slate-400 hover:bg-cyan-50 hover:text-cyan-500 dark:hover:bg-cyan-500/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => setVDeleteConfirm(v.id)} className="p-2.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            , document.body)}

            {/* Video Delete Confirm */}
            {vDeleteConfirm !== null && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
                        <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Delete Video?</h3>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => deleteVideo(vDeleteConfirm)} className="flex-1 py-3 bg-rose-600 rounded-xl text-white font-bold">Delete</button>
                            <button onClick={() => setVDeleteConfirm(null)} className="flex-1 py-3 bg-slate-800 rounded-xl text-white font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            , document.body)}

            {/* Course Delete Confirm Modal */}
            {deleteConfirm !== null && createPortal(
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                     <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl">
                        <h3 className="text-xl font-bold dark:text-white mb-2">Delete Course?</h3>
                        <p className="text-slate-400 mb-8 text-sm">Videos and progress connected to this course will also be affected.</p>
                        <div className="flex gap-3">
                            <button onClick={() => deleteCourse(deleteConfirm)} className="flex-1 py-3 bg-rose-600 rounded-xl text-white font-bold hover:bg-rose-500">Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-800 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                        </div>
                    </div>
                </div>
            , document.body)}
        </AppLayout>
    );
}
