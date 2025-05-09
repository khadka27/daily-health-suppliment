import ArticleAdminForm from "../article-admin-form"
import AdminSidebar from "../admin-sidebar"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">Article Content Management</h1>
          </div>
        </header>
        <main>
          <ArticleAdminForm />
        </main>
      </div>
    </div>
  )
}
