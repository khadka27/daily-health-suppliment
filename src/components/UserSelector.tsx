"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  name: string
  email: string
  role: "ADMINISTRATOR" | "EDITOR"
  isActive: boolean
}

interface UserSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  roleFilter?: "ADMINISTRATOR" | "EDITOR" | "ALL"
}

export function UserSelector({
  value,
  onValueChange,
  label = "User",
  placeholder = "Select a user",
  required = false,
  roleFilter = "ALL",
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()

      if (data.success) {
        let filteredUsers = data.users.filter((user: User) => user.isActive)

        if (roleFilter !== "ALL") {
          filteredUsers = filteredUsers.filter((user: User) => user.role === roleFilter)
        }

        setUsers(filteredUsers)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading users..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {!required && <SelectItem value="none">No User</SelectItem>}
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} ({user.role.toLowerCase()}) - {user.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
