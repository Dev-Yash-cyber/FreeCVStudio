import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore.js';

// Public Pages
import { LandingPage } from './pages/LandingPage.js';
import { FeaturesPage } from './pages/FeaturesPage.js';
import { TemplatesPage } from './pages/TemplatesPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.js';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage.js';
import { ResumesListPage } from './pages/ResumesListPage.js';
import { NewResumePage } from './pages/NewResumePage.js';
import { ResumeEditorPage } from './pages/ResumeEditorPage.js';
import { ResumePreviewPage } from './pages/ResumePreviewPage.js';
import { CoverLettersListPage } from './pages/CoverLettersListPage.js';
import { CoverLetterEditorPage } from './pages/CoverLetterEditorPage.js';
import { JobApplicationsPage } from './pages/JobApplicationsPage.js';
import { CareerToolsPage } from './pages/CareerToolsPage.js';
import { JdMatcherPage } from './pages/JdMatcherPage.js';
import { SettingsProfilePage } from './pages/SettingsProfilePage.js';
import { SettingsPreferencesPage } from './pages/SettingsPreferencesPage.js';
import { SettingsPrivacyPage } from './pages/SettingsPrivacyPage.js';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Protected Dashboard & Resumes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <ResumesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes/new"
          element={
            <ProtectedRoute>
              <NewResumePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes/:id/edit"
          element={
            <ProtectedRoute>
              <ResumeEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumes/:id/preview"
          element={
            <ProtectedRoute>
              <ResumePreviewPage />
            </ProtectedRoute>
          }
        />

        {/* Cover Letters */}
        <Route
          path="/cover-letters"
          element={
            <ProtectedRoute>
              <CoverLettersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cover-letters/:id/edit"
          element={
            <ProtectedRoute>
              <CoverLetterEditorPage />
            </ProtectedRoute>
          }
        />

        {/* Job Applications Tracker */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <JobApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Career Tools Suite */}
        <Route
          path="/career-tools"
          element={
            <ProtectedRoute>
              <CareerToolsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jd-matcher"
          element={
            <ProtectedRoute>
              <JdMatcherPage />
            </ProtectedRoute>
          }
        />

        {/* User Settings */}
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <SettingsProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/preferences"
          element={
            <ProtectedRoute>
              <SettingsPreferencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/privacy"
          element={
            <ProtectedRoute>
              <SettingsPrivacyPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
