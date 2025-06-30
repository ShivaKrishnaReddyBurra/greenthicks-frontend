"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, EyeOff, ImageIcon, Smartphone, Monitor, Plus, Save, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import {
  getBannerImages,
  createBannerImage,
  updateBannerImage,
  deleteBannerImage,
  reorderBannerImages,
} from "@/lib/api";

export default function BannerManagement() {
  const [bannerImages, setBannerImages] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLeafLoading, setIsLeafLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("desktop");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    altText: "",
    link: "",
    type: "desktop",
    isActive: true,
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Leaf loader component
const LeafLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="leafbase">
        <div className="lf">
          <div className="leaf1">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf2">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="leaf3">
            <div className="leaf11"></div>
            <div className="leaf12"></div>
          </div>
          <div className="tail"></div>
        </div>
      </div>
    </div>
  );
};

  // Fetch banner images
  const fetchBannerImages = async (type = "desktop") => {
    try {
      setIsPageLoading(true);
      console.log("Fetching banners with params:", { type, showInactive });
      const response = await getBannerImages(type, { admin: true, showInactive });
      console.log("API response:", response);
      setBannerImages(response.images || []);
    } catch (error) {
      console.error("Failed to fetch banner images:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch banner images",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerImages(activeTab);
  }, [activeTab, showInactive]);

  // Handle button clicks with leaf loader
  const handleButtonClick = async (action) => {
    setIsLeafLoading(true);
    try {
      await action();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setTimeout(() => setIsLeafLoading(false), 1000); // Simulate loading delay
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBanner && !selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    await handleButtonClick(async () => {
      const submitData = {
        ...formData,
        type: activeTab,
        order: formData.order || bannerImages.length,
      };

      if (editingBanner) {
        await updateBannerImage(editingBanner._id, submitData, selectedFile);
        toast({
          title: "Success",
          description: "Banner image updated successfully",
        });
      } else {
        await createBannerImage(submitData, selectedFile);
        toast({
          title: "Success",
          description: "Banner image created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchBannerImages(activeTab);
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      altText: "",
      link: "",
      type: "desktop",
      isActive: true,
      order: 0,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setEditingBanner(null);
  };

  // Handle edit
  const handleEdit = (banner) => {
    handleButtonClick(() => {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || "",
        altText: banner.altText || "",
        link: banner.link || "",
        type: banner.type || "desktop",
        isActive: banner.isActive !== false,
        order: banner.order || 0,
      });
      setPreviewUrl(banner.imageUrl);
      setIsDialogOpen(true);
    });
  };

  // Handle delete
  const handleDelete = async (bannerId) => {
    await handleButtonClick(async () => {
      await deleteBannerImage(bannerId);
      toast({
        title: "Success",
        description: "Banner image deleted successfully",
      });
      fetchBannerImages(activeTab);
    });
  };

  // Handle reorder
  const handleReorder = async (bannerId, direction) => {
    await handleButtonClick(async () => {
      const currentIndex = bannerImages.findIndex((b) => b._id === bannerId);
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (newIndex < 0 || newIndex >= bannerImages.length) return;

      const reorderedImages = [...bannerImages];
      [reorderedImages[currentIndex], reorderedImages[newIndex]] = [
        reorderedImages[newIndex],
        reorderedImages[currentIndex],
      ];

      const orderUpdates = reorderedImages.map((img, index) => ({
        id: img._id,
        order: index,
      }));

      await reorderBannerImages(orderUpdates);
      setBannerImages(reorderedImages);

      toast({
        title: "Success",
        description: "Banner order updated successfully",
      });
    });
  };

  // Toggle active status
  const toggleActive = async (banner) => {
    await handleButtonClick(async () => {
      await updateBannerImage(banner._id, {
        ...banner,
        isActive: !banner.isActive,
      });
      fetchBannerImages(activeTab);
      toast({
        title: "Success",
        description: `Banner ${banner.isActive ? "deactivated" : "activated"} successfully`,
      });
    });
  };

  // Handle cancel
  const handleCancel = () => {
    handleButtonClick(() => {
      setIsDialogOpen(false);
      resetForm();
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto min-h-screen">
      {isLeafLoading && <LeafLoader />}
      {isPageLoading ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mt-2"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                    <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-1">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Banner Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage hero section banner images for desktop and mobile
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={(checked) => {
                    handleButtonClick(() => {
                      setShowInactive(checked);
                      console.log("Show Inactive toggled:", checked);
                    });
                  }}
                />
                <Label htmlFor="show-inactive">Show Inactive Banners</Label>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() =>
                      handleButtonClick(() => {
                        resetForm();
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingBanner ? "Edit Banner Image" : "Add New Banner Image"}</DialogTitle>
                    <DialogDescription>Upload and configure a banner image for the hero section</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Banner title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="altText">Alt Text</Label>
                      <Input
                        id="altText"
                        value={formData.altText}
                        onChange={(e) => setFormData((prev) => ({ ...prev, altText: e.target.value }))}
                        placeholder="Alternative text for accessibility"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="link">Link (Optional)</Label>
                      <Input
                        id="link"
                        value={formData.link}
                        onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                          id="order"
                          type="number"
                          min="0"
                          value={formData.order}
                          onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Banner Image</Label>
                      <Input id="image" type="file" accept="image/*" onChange={handleFileSelect} className="cursor-pointer" />
                      <p className="text-sm text-muted-foreground">
                        Recommended: 1200x300px for desktop, 600x150px for mobile. Max 5MB.
                      </p>
                    </div>

                    {previewUrl && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="relative w-full max-h-64 border rounded-lg overflow-hidden">
                          <Image
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            width={1200}
                            height={300}
                            style={{ objectFit: "contain" }}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLeafLoading}>
                        {isLeafLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingBanner ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingBanner ? "Update" : "Create"}
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {bannerImages.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No banner images</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Get started by adding your first banner image for {activeTab} devices.
                    </p>
                    <Button
                      onClick={() =>
                        handleButtonClick(() => {
                          setIsDialogOpen(true);
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Banner
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bannerImages.map((banner, index) => (
                    <Card key={banner._id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm">{banner.title || `Banner ${index + 1}`}</CardTitle>
                            <CardDescription className="text-xs">Order: {banner.order || index}</CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={banner.isActive ? "default" : "secondary"}>
                              {banner.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="relative w-full max-h-64 border rounded overflow-hidden">
                          <Image
                            src={banner.imageUrl || "/placeholder.svg"}
                            alt={banner.altText || `Banner ${index + 1}`}
                            width={1200}
                            height={300}
                            style={{ objectFit: "contain" }}
                            className="w-full h-auto"
                          />
                        </div>

                        {banner.altText && <p className="text-xs text-muted-foreground truncate">{banner.altText}</p>}

                        {banner.link && <p className="text-xs text-blue-600 truncate">🔗 {banner.link}</p>}

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorder(banner._id, "up")}
                              disabled={index === 0 || isLeafLoading}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorder(banner._id, "down")}
                              disabled={index === bannerImages.length - 1 || isLeafLoading}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleActive(banner)}
                              disabled={isLeafLoading}
                            >
                              {banner.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(banner)}
                              disabled={isLeafLoading}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" disabled={isLeafLoading}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this banner image? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(banner._id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}