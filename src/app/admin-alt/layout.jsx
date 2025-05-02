import AdminAltLayout from "@/components/admin-alt-layout"

export const metadata = {
  title: "Admin Portal - Green Thicks",
  description: "Admin portal for Green Thicks e-commerce platform",
}

export default function Layout({ children }) {
  return <AdminAltLayout>{children}</AdminAltLayout>
}
