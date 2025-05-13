"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { fetchWithAuth } from "@/lib/api"

export default function ServiceAreasPage() {
  const [serviceAreas, setServiceAreas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedServiceArea, setSelectedServiceArea] = useState(null)
  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    isActive: true,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchServiceAreas()
  }, [currentPage])

  const fetchServiceAreas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchWithAuth(`/api/service-areas?page=${currentPage}&limit=10`)
      setServiceAreas(data.serviceAreas)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddServiceArea = async (e) => {
    e.preventDefault()
    try {
      await fetchWithAuth("/api/service-areas", {
        method: "POST",
        body: JSON.stringify(formData),
      })
      setShowAddModal(false)
      setFormData({
        pincode: "",
        city: "",
        state: "",
        isActive: true,
      })
      fetchServiceAreas()
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  const handleUpdateServiceArea = async (e) => {
    e.preventDefault()
    if (!selectedServiceArea) return
    try {
      await fetchWithAuth(`/api/service-areas/${selectedServiceArea.pincode}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })
      setShowEditModal(false)
      setSelectedServiceArea(null)
      fetchServiceAreas()
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  const handleDeleteServiceArea = async (pincode) => {
    if (!confirm("Are you sure you want to delete this service area?")) return
    try {
      await fetchWithAuth(`/api/service-areas/${pincode}`, {
        method: "DELETE",
      })
      fetchServiceAreas()
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  const openEditModal = (serviceArea) => {
    setSelectedServiceArea(serviceArea)
    setFormData({
      pincode: serviceArea.pincode,
      city: serviceArea.city,
      state: serviceArea.state,
      isActive: serviceArea.isActive,
    })
    setShowEditModal(true)
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Service Areas Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service Area
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-3" />
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pincode
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  City
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  State
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {serviceAreas.map((area) => (
                <tr key={area.pincode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {area.pincode}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {area.city}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {area.state}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">{getStatusBadge(area.isActive)}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(area)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteServiceArea(area.pincode)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 text-sm sm:text-base"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 text-sm sm:text-base"
          >
            Next
          </button>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {serviceAreas.map((area) => (
          <div key={area.pincode} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Pincode: {area.pincode}</span>
                {getStatusBadge(area.isActive)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-300">City: {area.city}</div>
              <div className="text-sm text-gray-500 dark:text-gray-300">State: {area.state}</div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(area)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteServiceArea(area.pincode)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="p-4 flex flex-col items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Service Area Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Service Area</h2>
              <div onSubmit={handleAddServiceArea}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      required
                      pattern="\d{5,6}"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="isActive" className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddServiceArea}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    Add Service Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Area Modal */}
      {showEditModal && selectedServiceArea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Service Area</h2>
              <div onSubmit={handleUpdateServiceArea}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      value={formData.pincode}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm opacity-50 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="isActive" className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateServiceArea}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    Update Service Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}