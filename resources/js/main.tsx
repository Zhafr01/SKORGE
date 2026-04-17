import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/app.css';

import IntroOverlay from './components/skorge/IntroOverlay';
import PrivateRoute from './components/skorge/PrivateRoute';
import { AuthProvider } from './lib/auth';
import { I18nProvider } from './lib/i18n';
import { ThemeProvider } from './lib/theme';
import About from './pages/about';
import AdminDashboard from './pages/admin/index';
import AdminUsers from './pages/admin/users';
import AdminCourses from './pages/admin/courses';
import AdminJobRoles from './pages/admin/job-roles';
import AdminSystem from './pages/admin/system';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import CourseIndex from './pages/courses/index';
import JobRoleIndex from './pages/job-roles/index';
import JobRoleShow from './pages/job-roles/show';
import CourseShow from './pages/courses/show';
import JobBoardIndex from './pages/jobs/index';
import QuizShow from './pages/quiz/show';
import CertificatesIndex from './pages/user/certificates';
import MyCoursesIndex from './pages/user/my-courses';
import CVBuilder from './pages/user/cv-builder';
import AIOnboarding from './pages/onboarding';
import UserProfile from './pages/user/profile';

import RecommendationWizard from './pages/job-roles/recommendation';
import StatsIndex from './pages/stats/index';
import Dashboard from './pages/dashboard';
import Welcome from './pages/welcome';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <IntroOverlay />
            <ThemeProvider>
                <I18nProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<Welcome />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/job-roles" element={<JobRoleIndex />} />
                            <Route path="/job-roles/:id" element={<JobRoleShow />} />
                            <Route path="/courses" element={<CourseIndex />} />
                            <Route path="/courses/:id" element={<CourseShow />} />
                            <Route path="/quiz/:id" element={<QuizShow />} />

                            {/* Protected routes */}
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/stats" element={<PrivateRoute><StatsIndex /></PrivateRoute>} />
                            <Route path="/onboarding" element={<PrivateRoute><AIOnboarding /></PrivateRoute>} />
                            <Route path="/job-roles/recommendation" element={<PrivateRoute><RecommendationWizard /></PrivateRoute>} />
                            <Route path="/user/certificates" element={<PrivateRoute><CertificatesIndex /></PrivateRoute>} />
                            <Route path="/user/my-courses" element={<PrivateRoute><MyCoursesIndex /></PrivateRoute>} />
                            <Route path="/user/cv-builder" element={<PrivateRoute><CVBuilder /></PrivateRoute>} />
                            <Route path="/user/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
                            <Route path="/jobs" element={<PrivateRoute><JobBoardIndex /></PrivateRoute>} />
                            
                            {/* Admin routes */}
                            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                            <Route path="/admin/users" element={<PrivateRoute><AdminUsers /></PrivateRoute>} />
                            <Route path="/admin/courses" element={<PrivateRoute><AdminCourses /></PrivateRoute>} />
                            <Route path="/admin/job-roles" element={<PrivateRoute><AdminJobRoles /></PrivateRoute>} />
                            <Route path="/admin/system" element={<PrivateRoute><AdminSystem /></PrivateRoute>} />
                        </Routes>
                    </AuthProvider>
                </I18nProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
