"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "",
    maxUses: "",
    expiryDate: "",
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchWithAuth("/api/coupons");
      setCoupons(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await fetchWithAuth("/api/coupons", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          minimumOrderAmount: parseFloat(formData.minimumOrderAmount) || 0,
          maxUses: parseInt(formData.maxUses) || 0,
          expiryDate: new Date(formData.expiryDate).toISOString(),
        }),
      });
      setShowAddModal(false);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minimumOrderAmount: "",
        maxUses: "",
        expiryDate: "",
        active: true,
      });
      fetchCoupons();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCoupon) return;
    try {
      await fetchWithAuth(`/api/coupons/${selectedCoupon.globalId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          minimumOrderAmount: parseFloat(formData.minimumOrderAmount) || 0,
          maxUses: parseInt(formData.maxUses) || 0,
          expiryDate: new Date(formData.expiryDate).toISOString(),
        }),
      });
      setShowEditModal(false);
      setSelectedCoupon(null);
      fetchCoupons();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetchWithAuth(`/api/coupons/${couponId}`, {
        method: "DELETE",
      });
      fetchCoupons();
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount.toString(),
      maxUses: coupon.maxUses.toString(),
      expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
      active: coupon.active,
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (active) => {
    return active ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle size={12} className="mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircle size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">Coupons Management</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
          Add Coupon
        </Button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 p-3 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Min. Order
                </th>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 dark:text-white">
                    {coupon.code}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : formatCurrency(coupon.discountValue)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                    {formatCurrency(coupon.minimumOrderAmount)}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                    {coupon.maxUses === 0 ? "Unlimited" : `${coupon.usedCount}/${coupon.maxUses}`}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-xs text-gray-500 dark:text-gray-300">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-4 py-3">{getStatusBadge(coupon.active)}</td>
                  <td className="px-3 sm:px-4 py-3 text-right text-xs font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.globalId)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3 mb-4">
        {coupons.map((coupon) => (
          <div key={coupon.globalId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-900 dark:text-white">{coupon.code}</span>
                {getStatusBadge(coupon.active)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Discount: {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">Min. Order: {formatCurrency(coupon.minimumOrderAmount)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Uses: {coupon.maxUses === 0 ? "Unlimited" : `${coupon.usedCount}/${coupon.maxUses}`}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => openEditModal(coupon)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon.globalId)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-[95vw] max-h-[75vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3">Add New Coupon</h2>
            <form onSubmit={handleAddCoupon}>
              <div className="space-y-3">
                <div>
                  <label htmlFor="code" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discountType" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discountValue" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="minimumOrderAmount" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    id="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="maxUses" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Max Uses (0 for unlimited)
                  </label>
                  <input
                    type="number"
                    id="maxUses"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="active" className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white">
                  Add Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {showEditModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-[95vw] max-h-[75vh] overflow-y-auto border border-gray-100 dark:border-gray-700">
            <h2 className="text-base font-bold text-gray-800 dark:text-white mb-3">Edit Coupon</h2>
            <form onSubmit={handleUpdateCoupon}>
              <div className="space-y-3">
                <div>
                  <label htmlFor="code" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="discountType" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="discountValue" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="minimumOrderAmount" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    id="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="maxUses" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Max Uses (0 for unlimited)
                  </label>
                  <input
                    type="number"
                    id="maxUses"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="expiryDate" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-xs shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="active" className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  className="px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white">
                  Update Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}