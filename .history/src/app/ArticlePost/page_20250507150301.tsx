"use client"

import { useState } from "react"
import AdminSidebar from "../admin-sidebar"
import ArticleAdminForm from "../article-admin-form"
import DashboardSection from "../dashboard-section"


export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("articles")

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="lg:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "articles" && "Article Content Management"}
              {activeSection === "media" && "Media Library"}
              {activeSection === "users" && "User Management"}
              {activeSection === "analytics" && "Analytics"}
              {activeSection === "settings" && "Settings"}
            </h1>
          </div>
        </header>
        <main>
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "articles" && <ArticleAdminForm />}
  ?Z
        </main>
      </div>
    </div>
  )
}
