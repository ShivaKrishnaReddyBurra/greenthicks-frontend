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
  const [loading, setLoading] = useState(true);
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
  const [uploading, setUploading] = useState(false);

  // Fetch banner images
  const fetchBannerImages = async (type = "desktop") => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerImages(activeTab);
  }, [activeTab, showInactive]);

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

    try {
      setUploading(true);

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
    } catch (error) {
      console.error("Failed to save banner image:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save banner image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
  };

  // Handle delete
  const handleDelete = async (bannerId) => {
    try {
      await deleteBannerImage(bannerId);
      toast({
        title: "Success",
        description: "Banner image deleted successfully",
      });
      fetchBannerImages(activeTab);
    } catch (error) {
      console.error("Failed to delete banner image:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner image",
        variant: "destructive",
      });
    }
  };

  // Handle reorder
  const handleReorder = async (bannerId, direction) => {
    try {
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
    } catch (error) {
      console.error("Failed to reorder banners:", error);
      toast({
        title: "Error",
        description: "Failed to reorder banners",
        variant: "destructive",
      });
    }
  };

  // Toggle active status
  const toggleActive = async (banner) => {
    try {
      await updateBannerImage(banner._id, {
        ...banner,
        isActive: !banner.isActive,
      });
      fetchBannerImages(activeTab);
      toast({
        title: "Success",
        description: `Banner ${banner.isActive ? "deactivated" : "activated"} successfully`,
      });
    } catch (error) {
      console.error("Failed to toggle banner status:", error);
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-auto min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage hero section banner images for desktop and mobile</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-inactive"
              checked={showInactive}
              onCheckedChange={(checked) => {
                setShowInactive(checked);
                console.log("Show Inactive toggled:", checked);
              }}
            />
            <Label htmlFor="show-inactive">Show Inactive Banners</Label>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
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
                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bannerImages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No banner images</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by adding your first banner image for {activeTab} devices.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReorder(banner._id, "down")}
                          disabled={index === bannerImages.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => toggleActive(banner)}>
                          {banner.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
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
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(banner._id)}>Delete</AlertDialogAction>
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
    </div>
  );
}