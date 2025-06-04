"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X, Camera, Key } from "lucide-react"
import { getUserProfile, updateUser } from "@/lib/fetch-without-auth"

export default function AdminProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null)
        const data = await getUserProfile()
        setProfile(data.user || data)
        setFormData({
          name: data.user?.name || data.name || "",
          email: data.user?.email || data.email || "",
          phone: data.user?.phone || data.phone || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      await updateUser(profile.globalId, formData)
      setProfile({ ...profile, ...formData })
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
    })
    setEditing(false)
    setError(null)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setSaving(true)
    setError(null)

    try {
      // In a real app, you would have a separate endpoint for password changes
      await updateUser(profile.globalId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordForm(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error changing password:", error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">
          <User size={48} className="mx-auto mb-2" />
          <p className="text-lg font-medium">Error loading profile</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            <h2 className="text-xl font-bold mb-2">{profile?.name || "Admin User"}</h2>
            <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
              <Shield size={16} className="mr-1" />
              Administrator
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-center mb-2">
                <Calendar size={16} className="mr-2" />
                Joined {formatDate(profile?.createdAt)}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-lg shadow-md p-6 mt-6">
            <h3 className="font-bold mb-4">Account Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-medium">{profile?.globalId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">{profile?.isVerified ? "Verified" : "Unverified"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{profile?.isAdmin ? "Administrator" : "User"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save size={16} className="mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User size={16} className="inline mr-2" />
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="p-3 bg-muted/50 rounded-lg">{profile?.name || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email Address
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="p-3 bg-muted/50 rounded-lg">{profile?.email || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="p-3 bg-muted/50 rounded-lg">{profile?.phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Member Since
                </label>
                <p className="p-3 bg-muted/50 rounded-lg">{formatDate(profile?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Security Settings</h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Key size={16} className="mr-2" />
                Change Password
              </button>
            </div>

            {showPasswordForm && (
              <div className="space-y-4 border-t pt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-background"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                      setError(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
                <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                  <span className="text-red-600">Disabled</span>
                  <button className="text-primary hover:underline text-sm">Enable</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Login Sessions</label>
                <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                  <span>1 active session</span>
                  <button className="text-primary hover:underline text-sm">Manage</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
