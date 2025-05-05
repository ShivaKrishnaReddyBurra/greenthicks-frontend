"use client"

import { useState, useEffect } from "react"
import { DeliveryLayout } from "@/components/delivery-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Download, Calendar, TrendingUp, Clock } from "lucide-react"

export default function DeliveryEarningsPage() {
  const [loading, setLoading] = useState(true)
  const [earnings, setEarnings] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [timeRange, setTimeRange] = useState("week")

  useEffect(() => {
    // Simulate loading earnings data
    const loadEarningsData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock earnings data
        setEarnings({
          today: 450,
          week: 2850,
          month: 12500,
          pending: 650,
          totalDeliveries: {
            today: 6,
            week: 38,
            month: 165,
          },
          averageRating: 4.8,
        })

        // Mock transactions
        setTransactions([
          {
            id: "TRX-001",
            date: "2025-05-04",
            type: "Delivery Earnings",
            amount: 450,
            status: "Completed",
          },
          {
            id: "TRX-002",
            date: "2025-05-03",
            type: "Delivery Earnings",
            amount: 520,
            status: "Completed",
          },
          {
            id: "TRX-003",
            date: "2025-05-02",
            type: "Delivery Earnings",
            amount: 380,
            status: "Completed",
          },
          {
            id: "TRX-004",
            date: "2025-05-01",
            type: "Delivery Earnings",
            amount: 410,
            status: "Completed",
          },
          {
            id: "TRX-005",
            date: "2025-04-30",
            type: "Delivery Earnings",
            amount: 490,
            status: "Completed",
          },
          {
            id: "TRX-006",
            date: "2025-04-29",
            type: "Bonus",
            amount: 200,
            status: "Completed",
          },
          {
            id: "TRX-007",
            date: "2025-04-28",
            type: "Delivery Earnings",
            amount: 400,
            status: "Completed",
          },
        ])
      } catch (error) {
        console.error("Error loading earnings data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEarningsData()
  }, [])

  const handleDownloadStatement = () => {
    // In a real app, this would download a PDF or CSV
    alert("Earnings statement downloaded")
  }

  if (loading) {
    return (
      <DeliveryLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DeliveryLayout>
    )
  }

  return (
    <DeliveryLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Earnings</h1>
        <Button onClick={handleDownloadStatement}>
          <Download className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.today}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                {earnings.totalDeliveries.today} deliveries
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.week}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                {earnings.totalDeliveries.week} deliveries
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.month}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                {earnings.totalDeliveries.month} deliveries
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{earnings.pending}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-yellow-500 inline-flex items-center">Processing</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Transaction ID</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-right py-3 px-4">Amount</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{transaction.id}</td>
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.type}</td>
                    <td className="py-3 px-4 text-right">₹{transaction.amount}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Bank Account</h3>
              <p className="text-sm text-muted-foreground">HDFC Bank ••••6789</p>
              <Button variant="outline" size="sm" className="mt-2">
                Update Bank Details
              </Button>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payout Schedule</h3>
              <p className="text-sm text-muted-foreground">Weekly (Every Monday)</p>
              <Button variant="outline" size="sm" className="mt-2">
                Change Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DeliveryLayout>
  )
}
