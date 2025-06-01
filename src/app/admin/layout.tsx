import type { ReactNode } from "react"
import Link from "next/link"
import { FileText, Users, FolderTree, Settings, BarChart3, Home, ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-gray-800 dark:text-white">CMS Admin</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Dashboard
            </p>
            <Link
              href="/admin"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Home className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Overview
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <BarChart3 className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Analytics
            </Link>
          </div>

          <div className="mt-8 space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Content
            </p>
            <Link
              href="/admin/articles"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md bg-gray-100 dark:bg-gray-700 font-medium"
            >
              <FileText className="h-5 w-5 mr-3 text-blue-500" />
              Articles
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FolderTree className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Categories
            </Link>
          </div>

          <div className="mt-8 space-y-1">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
              Administration
            </p>
            <Link
              href="/admin/users"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Users className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Users
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
              Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold">CMS Admin</span>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
