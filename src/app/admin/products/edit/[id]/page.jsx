"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Trash2, Upload, ArrowLeft, ImagePlus, Eye } from "lucide-react";
import { getProductById, updateProduct, setPrimaryImage, deleteImage } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="grid grid-cols-5 gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="space-y-4">
      <div className="bg-gray-200 rounded-lg h-20"></div>
      <div className="bg-gray-200 rounded-lg h-20"></div>
    </div>
  </div>
);

export default function ProductEditor({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [newTag, setNewTag] = useState("");
  const [newVitamin, setNewVitamin] = useState({ name: "", amount: "", daily: "" });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImagesPrimary, setNewImagesPrimary] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(Number.parseInt(id));
        setProduct({
          ...data,
          nutrition: data.nutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            vitamins: [],
          },
          policies: data.policies || {
            return: "",
            shipping: "",
            availability: "",
          },
          tags: data.tags || [],
          images: data.images || [],
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [id, toast]);

  const handleAddTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct({ ...product, tags: [...product.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProduct({ ...product, tags: product.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleAddVitamin = () => {
    if (newVitamin.name && newVitamin.amount) {
      setProduct({
        ...product,
        nutrition: {
          ...product.nutrition,
          vitamins: [...product.nutrition.vitamins, { ...newVitamin }],
        },
      });
      setNewVitamin({ name: "", amount: "", daily: "" });
    }
  };

  const handleRemoveVitamin = (index) => {
    const updatedVitamins = [...product.nutrition.vitamins];
    updatedVitamins.splice(index, 1);
    setProduct({
      ...product,
      nutrition: { ...product.nutrition, vitamins: updatedVitamins },
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const maxSize = 3 * 1024 * 1024; // 3MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Error",
        description: "Some images exceed 3MB. Please upload smaller images.",
        variant: "destructive",
      });
      return;
    }

    const totalImages = images.length + files.length + (keepExistingImages ? product.images.length : 0);
    if (totalImages > 6) {
      toast({
        title: "Error",
        description: "Maximum of 6 images allowed.",
        variant: "destructive",
      });
      return;
    }

    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setNewImagesPrimary([...newImagesPrimary, ...files.map(() => false)]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedPrimary = [...newImagesPrimary];
    updatedPrimary.splice(index, 1);
    setNewImagesPrimary(updatedPrimary);
  };

  const handleSetPrimaryNewImage = (index) => {
    setNewImagesPrimary(newImagesPrimary.map((_, i) => i === index));
    setProduct({
      ...product,
      images: product.images.map((img) => ({ ...img, primary: false })),
    });
  };

  const handleSetPrimaryImage = async (imageUrl) => {
    try {
      await setPrimaryImage(Number.parseInt(id), imageUrl);
      setProduct({
        ...product,
        images: product.images.map((img) => ({
          ...img,
          primary: img.url === imageUrl,
        })),
      });
      setNewImagesPrimary(newImagesPrimary.map(() => false));
      toast({
        title: "Success",
        description: "Primary image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set primary image.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      await deleteImage(Number.parseInt(id), imageUrl);
      const updatedImages = product.images.filter((img) => img.url !== imageUrl);
      setProduct({
        ...product,
        images: updatedImages,
      });

      if (product.images.find((img) => img.url === imageUrl)?.primary && images.length > 0) {
        handleSetPrimaryNewImage(0);
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!product.name || !product.price || !product.category || !product.unit || (product.images.length === 0 && images.length === 0)) {
        throw new Error("Please fill all required fields and upload at least one image.");
      }

      const productData = {
        name: product.name,
        description: product.description,
        price: Number.parseFloat(product.price),
        originalPrice: Number.parseFloat(product.originalPrice || product.price),
        category: product.category,
        unit: product.unit,
        stock: Number.parseInt(product.stock || 0),
        featured: product.featured || false,
        bestseller: product.bestseller || false,
        seasonal: product.seasonal || false,
        new: product.new || false,
        organic: product.organic || false,
        tags: product.tags || [],
        nutrition: product.nutrition,
        policies: product.policies,
        sku: product.sku || `PROD-${id}`,
        published: product.published || false,
      };

      const imageData = images.map((_, index) => ({
        primary: newImagesPrimary[index],
      }));

      await updateProduct(Number.parseInt(id), productData, images, imageData, keepExistingImages);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      setImages([]);
      setImagePreviews([]);
      setNewImagesPrimary([]);

      const updatedProduct = await getProductById(Number.parseInt(id));
      setProduct({
        ...updatedProduct,
        nutrition: updatedProduct.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          vitamins: [],
        },
        policies: updatedProduct.policies || {
          return: "",
          shipping: "",
          availability: "",
        },
        tags: updatedProduct.tags || [],
        images: updatedProduct.images || [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  const categories = [
    "leafy", "fruit", "root", "herbs", "milk", "pulses", "grains", "spices", "nuts", "oils", "snacks", "beverages",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p>Make changes to your product information, images, and settings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => window.open(`/products/${product.globalId}`, "_blank")}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the basic details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={product.sku || ""}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={product.description || ""}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={product.price || ""}
                    onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={product.originalPrice || ""}
                    onChange={(e) => setProduct({ ...product, originalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={product.stock || ""}
                    onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={product.category}
                    onValueChange={(value) => setProduct({ ...product, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    value={product.unit || ""}
                    onChange={(e) => setProduct({ ...product, unit: e.target.value })}
                    placeholder="e.g., kg, pack"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button onClick={handleAddTag} size="sm">
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Control the visibility and status of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">Make this product visible on your store.</p>
                </div>
                <Switch
                  id="published"
                  checked={product.published}
                  onCheckedChange={(checked) => setProduct({ ...product, published: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">Show in featured sections.</p>
                </div>
                <Switch
                  id="featured"
                  checked={product.featured}
                  onCheckedChange={(checked) => setProduct({ ...product, featured: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bestseller">Bestseller</Label>
                  <p className="text-sm text-muted-foreground">Mark as a top-selling product.</p>
                </div>
                <Switch
                  id="bestseller"
                  checked={product.bestseller}
                  onCheckedChange={(checked) => setProduct({ ...product, bestseller: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="seasonal">Seasonal</Label>
                  <p className="text-sm text-muted-foreground">Mark as a seasonal product.</p>
                </div>
                <Switch
                  id="seasonal"
                  checked={product.seasonal}
                  onCheckedChange={(checked) => setProduct({ ...product, seasonal: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new">New</Label>
                  <p className="text-sm text-muted-foreground">Mark as a new product.</p>
                </div>
                <Switch
                  id="new"
                  checked={product.new}
                  onCheckedChange={(checked) => setProduct({ ...product, new: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="organic">Organic</Label>
                  <p className="text-sm text-muted-foreground">Mark as an organic product.</p>
                </div>
                <Switch
                  id="organic"
                  checked={product.organic}
                  onCheckedChange={(checked) => setProduct({ ...product, organic: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Manage product images. The primary image is displayed first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Keep Existing Images</Label>
                <Switch
                  checked={keepExistingImages}
                  onCheckedChange={setKeepExistingImages}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.images.map((image) => (
                  <div key={`${image.url}`} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={image.url || "/placeholder.png"}
                        alt="Product image"
                        fill
                        className="object-cover"
                      />
                      {image.primary && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="default">Primary</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimaryImage(image.url)}
                        disabled={image.primary}
                      >
                        {image.primary ? "Primary" : "Set as Primary"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(image.url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {imagePreviews.map((preview, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`New image preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {newImagesPrimary[index] && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="default">Primary</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimaryNewImage(index)}
                        disabled={newImagesPrimary[index]}
                      >
                        {newImagesPrimary[index] ? "Primary" : "Set as Primary"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveNewImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border border-dashed rounded-lg overflow-hidden">
                  <div className="aspect-square flex flex-col items-center justify-center p-6 text-center">
                    <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="font-medium">Add Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">Upload a new product image (max 3MB)</p>
                    <Button variant="secondary" size="sm" asChild>
                      <label>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
              <CardDescription>Add nutritional information for your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={product.nutrition.calories || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: { ...product.nutrition, calories: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={product.nutrition.protein || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: { ...product.nutrition, protein: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={product.nutrition.carbs || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: { ...product.nutrition, carbs: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={product.nutrition.fat || ""}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        nutrition: { ...product.nutrition, fat: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  value={product.nutrition.fiber || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      nutrition: { ...product.nutrition, fiber: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <Label>Vitamins & Minerals</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>% Daily Value</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.nutrition.vitamins.map((vitamin, index) => (
                      <TableRow key={index}>
                        <TableCell>{vitamin.name}</TableCell>
                        <TableCell>{vitamin.amount}</TableCell>
                        <TableCell>{vitamin.daily}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveVitamin(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vitaminName">Name</Label>
                    <Input
                      id="vitaminName"
                      value={newVitamin.name}
                      onChange={(e) => setNewVitamin({ ...newVitamin, name: e.target.value })}
                      placeholder="e.g., Vitamin C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitaminAmount">Amount</Label>
                    <Input
                      id="vitaminAmount"
                      value={newVitamin.amount}
                      onChange={(e) => setNewVitamin({ ...newVitamin, amount: e.target.value })}
                      placeholder="e.g., 90mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vitaminDaily">% Daily Value</Label>
                    <Input
                      id="vitaminDaily"
                      value={newVitamin.daily}
                      onChange={(e) => setNewVitamin({ ...newVitamin, daily: e.target.value })}
                      placeholder="e.g., 100%"
                    />
                  </div>
                </div>
                <Button onClick={handleAddVitamin} size="sm">
                  Add Vitamin/Mineral
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Policies</CardTitle>
              <CardDescription>Describe your product policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  rows="3"
                  value={product.policies.return || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: { ...product.policies, return: e.target.value },
                    })
                  }
                  placeholder="Describe the return policy..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                <Textarea
                  id="shippingPolicy"
                  rows="3"
                  value={product.policies.shipping || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: { ...product.policies, shipping: e.target.value },
                    })
                  }
                  placeholder="Describe the shipping policy..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  rows="3"
                  value={product.policies.availability || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      policies: { ...product.policies, availability: e.target.value },
                    })
                  }
                  placeholder="Describe availability..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}