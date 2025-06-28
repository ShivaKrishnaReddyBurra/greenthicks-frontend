"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  useEffect(() => {
    setFilteredCoupons(
      coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, coupons]);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchWithAuth("/api/coupons");
      setCoupons(data);
      setFilteredCoupons(data);
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
          discountValue: formData.discountType === "free_delivery" ? 0 : parseFloat(formData.discountValue),
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
          discountValue: formData.discountType === "free_delivery" ? 0 : parseFloat(formData.discountValue),
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

  const getStatusBadge = (active) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${active ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"}`}>
      {active ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
      {active ? "Active" : "Inactive"}
    </span>
  );

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === "free_delivery") return "Free Delivery";
    return coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue);
  };

  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
            <div className="flex justify-end space-x-3">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mt-4 md:mt-0"></div>
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupons Management</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by coupon code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Coupon
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {filteredCoupons.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No coupons found matching "{searchQuery}"
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Code", "Discount", "Min. Order", "Uses", "Expiry", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.globalId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getDiscountDisplay(coupon)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(coupon.minimumOrderAmount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {coupon.maxUses === 0 ? "Unlimited" : `${coupon.usedCount}/${coupon.maxUses}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(coupon.active)}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.globalId)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredCoupons.map((coupon) => (
            <div key={coupon.globalId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{coupon.code}</span>
                  {getStatusBadge(coupon.active)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Discount: {getDiscountDisplay(coupon)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Min. Order: {formatCurrency(coupon.minimumOrderAmount)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Uses: {coupon.maxUses === 0 ? "Unlimited" : `${coupon.usedCount}/${coupon.maxUses}`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Expiry: {new Date(coupon.expiryDate).toLocaleDateString()}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => openEditModal(coupon)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.globalId)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Create New Coupon</h2>
              <div className="space-y-5" onSubmit={handleAddCoupon}>
                <div>
                  <Label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Coupon Code
                  </Label>
                  <Input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Type
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_delivery">Free Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.discountType !== "free_delivery" && (
                  <div>
                    <Label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Discount Value
                    </Label>
                    <Input
                      type="number"
                      id="discountValue"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                      required
                      min="0"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="minimumOrderAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Order Amount
                  </Label>
                  <Input
                    type="number"
                    id="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Uses (0 for unlimited)
                  </Label>
                  <Input
                    type="number"
                    id="maxUses"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Label htmlFor="active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </Label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleAddCoupon}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    Create Coupon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Coupon Modal */}
        {showEditModal && selectedCoupon && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Edit Coupon</h2>
              <div className="space-y-5" onSubmit={handleUpdateCoupon}>
                <div>
                  <Label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Coupon Code
                  </Label>
                  <Input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Type
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                  >
                    <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_delivery">Free Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.discountType !== "free_delivery" && (
                  <div>
                    <Label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Discount Value
                    </Label>
                    <Input
                      type="number"
                      id="discountValue"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                      required
                      min="0"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="minimumOrderAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Order Amount
                  </Label>
                  <Input
                    type="number"
                    id="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Uses (0 for unlimited)
                  </Label>
                  <Input
                    type="number"
                    id="maxUses"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiry Date
                  </Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Label htmlFor="active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active
                  </Label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleUpdateCoupon}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    Update Coupon
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}