"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, X, ArrowLeft, Save, ImagePlus, Trash2 } from 'lucide-react';
import { createProduct } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Component to add a new product with responsive UI
export default function AddProduct() {
  const router = useRouter();
  const { toast } = useToast();

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    unit: '',
    sku: '',
    discount: '',
    featured: false,
    bestseller: false,
    new: true,
    seasonal: false,
    organic: false,
    tags: [],
    nutrition: {
      calories: '0',
      protein: '0',
      carbs: '0',
      fat: '0',
      fiber: '0',
      vitamins: [],
    },
    policies: {
      return: '',
      shipping: '',
      availability: '',
    },
    published: false,
  });

  // State for image management
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImagesPrimary, setNewImagesPrimary] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newVitamin, setNewVitamin] = useState({ name: '', amount: '', daily: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Product categories
  const categories = [
    'leafy', 'fruit', 'root', 'herbs', 'milk', 'pulses', 'grains', 'spices', 'nuts', 'oils', 'snacks', 'beverages',
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle nutrition input changes
  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      nutrition: {
        ...formData.nutrition,
        [name]: value,
      },
    });
  };

  // Handle policy input changes
  const handlePolicyChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      policies: {
        ...formData.policies,
        [name]: value,
      },
    });
  };

  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Add a new vitamin/mineral
  const handleAddVitamin = () => {
    if (newVitamin.name && newVitamin.amount) {
      setFormData({
        ...formData,
        nutrition: {
          ...formData.nutrition,
          vitamins: [...formData.nutrition.vitamins, { ...newVitamin }],
        },
      });
      setNewVitamin({ name: '', amount: '', daily: '' });
    }
  };

  // Remove a vitamin/mineral
  const handleRemoveVitamin = (index) => {
    const updatedVitamins = [...formData.nutrition.vitamins];
    updatedVitamins.splice(index, 1);
    setFormData({
      ...formData,
      nutrition: { ...formData.nutrition, vitamins: updatedVitamins },
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: 'Error',
        description: 'Some images exceed 5MB. Please upload smaller images.',
        variant: 'destructive',
      });
      return;
    }

    if (images.length + files.length > 6) {
      toast({
        title: 'Error',
        description: 'Maximum of 6 images allowed.',
        variant: 'destructive',
      });
      return;
    }

    const updatedImages = [...images, ...files];
    setImages(updatedImages);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const updatedPrimary = updatedImages.map((_, index) => index === 0 && images.length === 0);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setNewImagesPrimary(updatedPrimary);
  };

  // Remove an image
  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedPrimary = [...newImagesPrimary];
    const wasPrimary = updatedPrimary[index];
    updatedPrimary.splice(index, 1);
    if (wasPrimary && updatedImages.length > 0) {
      updatedPrimary[0] = true;
    }
    setNewImagesPrimary(updatedPrimary);
  };

  // Set an image as primary
  const handleSetPrimaryImage = (index) => {
    const updatedPrimary = images.map((_, i) => i === index);
    setNewImagesPrimary(updatedPrimary);
  };

  // Validate form data before submission
  const validateFormData = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push('Product name is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      errors.push('Price must be a positive number');
    }
    if (!categories.includes(formData.category)) errors.push('Invalid category');
    if (!formData.unit.trim()) errors.push('Unit is required');
    if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      errors.push('Stock must be a non-negative integer');
    }
    if (images.length === 0) errors.push('At least one image is required');
    if (!Array.isArray(formData.tags)) errors.push('Tags must be an array');
    if (typeof formData.nutrition !== 'object' || formData.nutrition === null) {
      errors.push('Nutrition must be an object');
    }
    if (typeof formData.policies !== 'object' || formData.policies === null) {
      errors.push('Policies must be an object');
    }
    if (formData.discount && (isNaN(parseInt(formData.discount)) || parseInt(formData.discount) < 0 || parseInt(formData.discount) > 100)) {
      errors.push('Discount must be between 0 and 100');
    }

    if (errors.length > 0) {
      console.error('Validation errors:', errors);
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate form data
      const validationErrors = validateFormData();
      if (validationErrors.length > 0) {
        toast({
          title: 'Validation Error',
          description: validationErrors.join(', '),
          variant: 'destructive',
        });
        return;
      }

      // Build structured product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        unit: formData.unit.trim(),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : undefined,
        featured: Boolean(formData.featured),
        bestseller: Boolean(formData.bestseller),
        seasonal: Boolean(formData.seasonal),
        new: Boolean(formData.new),
        organic: Boolean(formData.organic),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        nutrition: {
          calories: formData.nutrition.calories ? parseFloat(formData.nutrition.calories) : 0,
          protein: formData.nutrition.protein ? parseFloat(formData.nutrition.protein) : 0,
          carbs: formData.nutrition.carbs ? parseFloat(formData.nutrition.carbs) : 0,
          fat: formData.nutrition.fat ? parseFloat(formData.nutrition.fat) : 0,
          fiber: formData.nutrition.fiber ? parseFloat(formData.nutrition.fiber) : 0,
          vitamins: Array.isArray(formData.nutrition.vitamins) ? formData.nutrition.vitamins : [],
        },
        policies: {
          return: formData.policies.return || '',
          shipping: formData.policies.shipping || '',
          availability: formData.policies.availability || '',
        },
        sku: formData.sku.trim() || `PROD-${Date.now()}`,
        published: Boolean(formData.published),
      };

      // Prepare image data
      const imageData = images.map((_, index) => ({
        primary: Boolean(newImagesPrimary[index]),
      }));

      // Debug: Log product data
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting product data:', JSON.stringify(productData, null, 2));
        console.log('Submitting image data:', JSON.stringify(imageData, null, 2));
        console.log('Images count:', images.length, 'Primary flags count:', newImagesPrimary.length);
      }

      // Submit via API
      await createProduct(productData, images, imageData);

      toast({
        title: 'Success',
        description: 'Product added successfully!',
        variant: 'success',
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Create product error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Create a new product with all necessary details.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={() => router.push('/admin/products')} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g., PROD-123"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g., kg, pack"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm" className="w-full sm:w-auto">
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
                  name="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">Show this product in featured sections.</p>
                </div>
                <Switch
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
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
                  name="bestseller"
                  checked={formData.bestseller}
                  onCheckedChange={(checked) => setFormData({ ...formData, bestseller: checked })}
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
                  name="seasonal"
                  checked={formData.seasonal}
                  onCheckedChange={(checked) => setFormData({ ...formData, seasonal: checked })}
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
                  name="new"
                  checked={formData.new}
                  onCheckedChange={(checked) => setFormData({ ...formData, new: checked })}
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
                  name="organic"
                  checked={formData.organic}
                  onCheckedChange={(checked) => setFormData({ ...formData, organic: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload product images. The primary image is displayed first.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={preview} className="border rounded-lg overflow-hidden">
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
                        onClick={() => handleSetPrimaryImage(index)}
                        disabled={newImagesPrimary[index]}
                      >
                        {newImagesPrimary[index] ? 'Primary' : 'Set as Primary'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
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
                    <p className="text-sm text-muted-foreground mb-4">Upload a new product image (max 5MB)</p>
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

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
              <CardDescription>Add nutritional information for your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    min="0"
                    value={formData.nutrition.calories}
                    onChange={handleNutritionChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    name="protein"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.nutrition.protein}
                    onChange={handleNutritionChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    name="carbs"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.nutrition.carbs}
                    onChange={handleNutritionChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    name="fat"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.nutrition.fat}
                    onChange={handleNutritionChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  name="fiber"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.nutrition.fiber}
                  onChange={handleNutritionChange}
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
                    {formData.nutrition.vitamins.map((vitamin, index) => (
                      <TableRow key={index}>
                        <TableCell>{vitamin.name}</TableCell>
                        <TableCell>{vitamin.amount}</TableCell>
                        <TableCell>{vitamin.daily}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVitamin(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Policies</CardTitle>
              <CardDescription>Define policies for returns, shipping, and availability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="return">Return Policy</Label>
                <Textarea
                  id="return"
                  name="return"
                  rows={3}
                  value={formData.policies.return}
                  onChange={handlePolicyChange}
                  placeholder="Describe the return policy..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping Policy</Label>
                <Textarea
                  id="shipping"
                  name="shipping"
                  rows={3}
                  value={formData.policies.shipping}
                  onChange={handlePolicyChange}
                  placeholder="Describe the shipping policy..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  name="availability"
                  rows={3}
                  value={formData.policies.availability}
                  onChange={handlePolicyChange}
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