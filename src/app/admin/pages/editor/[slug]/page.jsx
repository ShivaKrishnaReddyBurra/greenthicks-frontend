"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash,
  MoveUp,
  MoveDown,
  ImageIcon,
  Type,
  ListOrdered,
  Quote,
  FileText,
  Check,
  AlertTriangle,
  X,
} from "lucide-react"

export default function PageEditor({ params }) {
  const { slug } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchPage = async () => {
      try {
        // In a real app, this would be an API call to get the page data
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data for demonstration
        const pageData = {
          title: getPageTitle(slug),
          slug: slug,
          description: `This is the ${getPageTitle(slug)} page.`,
          lastUpdated: new Date().toISOString(),
        }

        setPage(pageData)

        // Mock blocks for demonstration
        setBlocks([
          {
            id: 1,
            type: "heading",
            content: getPageTitle(slug),
            level: 1,
          },
          {
            id: 2,
            type: "paragraph",
            content: "This is a sample paragraph for the page. Edit this content to update the page.",
          },
          {
            id: 3,
            type: "image",
            src: "/placeholder.svg?height=400&width=800",
            alt: "Sample image",
            caption: "This is a sample image",
          },
          {
            id: 4,
            type: "list",
            items: ["First item in the list", "Second item in the list", "Third item in the list"],
            ordered: false,
          },
        ])
      } catch (error) {
        console.error("Error fetching page:", error)
        setError("Failed to load page. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  const getPageTitle = (slug) => {
    const titles = {
      home: "Home Page",
      about: "About Us",
      contact: "Contact Us",
      faq: "Frequently Asked Questions",
      shipping: "Shipping & Delivery",
      returns: "Returns & Refunds",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
    }

    return titles[slug] || "Page"
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      // In a real app, this would be an API call to save the page data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Page updated successfully!")
    } catch (err) {
      setError("Failed to save changes. Please try again.")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = (type) => {
    const newId = blocks.length > 0 ? Math.max(...blocks.map((block) => block.id)) + 1 : 1

    const newBlock = {
      id: newId,
      type: type,
    }

    switch (type) {
      case "heading":
        newBlock.content = "New Heading"
        newBlock.level = 2
        break
      case "paragraph":
        newBlock.content = "New paragraph text"
        break
      case "image":
        newBlock.src = "/placeholder.svg?height=400&width=800"
        newBlock.alt = "Image description"
        newBlock.caption = ""
        break
      case "list":
        newBlock.items = ["New item"]
        newBlock.ordered = false
        break
      case "quote":
        newBlock.content = "New quote text"
        newBlock.author = ""
        break
    }

    setBlocks([...blocks, newBlock])
  }

  const handleDeleteBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId))
  }

  const handleMoveBlock = (blockId, direction) => {
    const index = blocks.findIndex((block) => block.id === blockId)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return
    }

    const newBlocks = [...blocks]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    // Swap the blocks
    ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]

    setBlocks(newBlocks)
  }

  const handleUpdateBlock = (blockId, updates) => {
    setBlocks(blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block)))
  }

  const handleUpdateListItem = (blockId, index, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          const newItems = [...block.items]
          newItems[index] = value
          return { ...block, items: newItems }
        }
        return block
      }),
    )
  }

  const handleAddListItem = (blockId) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return { ...block, items: [...block.items, "New item"] }
        }
        return block
      }),
    )
  }

  const handleDeleteListItem = (blockId, index) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId && block.items.length > 1) {
          const newItems = [...block.items]
          newItems.splice(index, 1)
          return { ...block, items: newItems }
        }
        return block
      }),
    )
  }

  const renderBlockEditor = (block) => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={block.level}
                onChange={(e) => handleUpdateBlock(block.id, { level: Number(e.target.value) })}
                className="w-24 p-2 border rounded-md"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
              <Input
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-2">
            <textarea
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="w-full p-2 border rounded-md min-h-[100px]"
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <div className="border rounded-md p-2">
              <img
                src={block.src || "/placeholder.svg"}
                alt={block.alt}
                className="w-full h-auto max-h-[300px] object-contain mb-2"
              />
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <Label className="w-24">Image URL:</Label>
                  <Input
                    value={block.src}
                    onChange={(e) => handleUpdateBlock(block.id, { src: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-24">Alt Text:</Label>
                  <Input
                    value={block.alt}
                    onChange={(e) => handleUpdateBlock(block.id, { alt: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-24">Caption:</Label>
                  <Input
                    value={block.caption}
                    onChange={(e) => handleUpdateBlock(block.id, { caption: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "list":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Label>List Type:</Label>
              <select
                value={block.ordered ? "ordered" : "unordered"}
                onChange={(e) => handleUpdateBlock(block.id, { ordered: e.target.value === "ordered" })}
                className="w-32 p-2 border rounded-md"
              >
                <option value="unordered">Bullet List</option>
                <option value="ordered">Numbered List</option>
              </select>
            </div>

            <div className="space-y-2">
              {block.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6">{block.ordered ? `${index + 1}.` : "•"}</span>
                  <Input
                    value={item}
                    onChange={(e) => handleUpdateListItem(block.id, index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteListItem(block.id, index)}
                    disabled={block.items.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={() => handleAddListItem(block.id)} className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        )

      case "quote":
        return (
          <div className="space-y-2">
            <textarea
              value={block.content}
              onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
              className="w-full p-2 border rounded-md min-h-[80px]"
              placeholder="Quote text"
            />
            <Input
              value={block.author || ""}
              onChange={(e) => handleUpdateBlock(block.id, { author: e.target.value })}
              placeholder="Author (optional)"
            />
          </div>
        )

      default:
        return <div>Unknown block type: {block.type}</div>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Page not found.</p>
        <Link href="/admin/pages" className="text-primary hover:underline mt-2 inline-block">
          Back to Pages
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin/pages" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Page: {page.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${slug === "home" ? "" : slug}`} target="_blank">
            <Button variant="outline">Preview</Button>
          </Link>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Page Information</CardTitle>
          <CardDescription>Edit the basic information about this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input id="title" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                disabled={slug === "home"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description</Label>
            <textarea
              id="description"
              rows={2}
              value={page.description}
              onChange={(e) => setPage({ ...page, description: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Page Content</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAddBlock("heading")}>
              <Type className="h-4 w-4 mr-1" />
              Heading
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddBlock("paragraph")}>
              <FileText className="h-4 w-4 mr-1" />
              Paragraph
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddBlock("image")}>
              <ImageIcon className="h-4 w-4 mr-1" />
              Image
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddBlock("list")}>
              <ListOrdered className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleAddBlock("quote")}>
              <Quote className="h-4 w-4 mr-1" />
              Quote
            </Button>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No content blocks yet.</p>
            <Button onClick={() => handleAddBlock("paragraph")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Content Block
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => (
              <Card key={block.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-muted px-2 py-1 rounded text-xs font-medium">
                      {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveBlock(block.id, "up")}
                        disabled={blocks.indexOf(block) === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMoveBlock(block.id, "down")}
                        disabled={blocks.indexOf(block) === blocks.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteBlock(block.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {renderBlockEditor(block)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
