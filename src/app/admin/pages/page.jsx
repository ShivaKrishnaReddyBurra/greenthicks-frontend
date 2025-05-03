"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, ExternalLink, Edit } from "lucide-react"

export default function AdminPages() {
  const [loading, setLoading] = useState(true)
  const [pages, setPages] = useState([])

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // In a real app, this would be an API call to get the pages
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock data for demonstration
        const pagesData = [
          {
            id: 1,
            title: "Home Page",
            slug: "home",
            lastUpdated: "2023-10-15T10:30:00Z",
          },
          {
            id: 2,
            title: "About Us",
            slug: "about",
            lastUpdated: "2023-10-10T14:45:00Z",
          },
          {
            id: 3,
            title: "Contact Us",
            slug: "contact",
            lastUpdated: "2023-10-05T09:15:00Z",
          },
          {
            id: 4,
            title: "Frequently Asked Questions",
            slug: "faq",
            lastUpdated: "2023-09-28T16:20:00Z",
          },
          {
            id: 5,
            title: "Shipping & Delivery",
            slug: "shipping",
            lastUpdated: "2023-09-20T11:10:00Z",
          },
          {
            id: 6,
            title: "Returns & Refunds",
            slug: "returns",
            lastUpdated: "2023-09-15T13:25:00Z",
          },
          {
            id: 7,
            title: "Privacy Policy",
            slug: "privacy",
            lastUpdated: "2023-09-10T15:40:00Z",
          },
          {
            id: 8,
            title: "Terms & Conditions",
            slug: "terms",
            lastUpdated: "2023-09-05T10:55:00Z",
          },
        ]

        setPages(pagesData)
      } catch (error) {
        console.error("Error fetching pages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Static Pages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                {page.title}
              </CardTitle>
              <CardDescription>
                <span className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last updated: {formatDate(page.lastUpdated)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Link href={`/${page.slug === "home" ? "" : page.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/pages/editor/${page.slug}`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
