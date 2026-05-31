import { AppSidebar } from "@/components/app-sidebar"
import CustomerRecordWizard from "@/components/admin/customer-records/CustomerRecordWizard"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

export default function NewCustomerRecordPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="@container/main flex min-w-0 flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6">
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">New Customer Record</h1>
              <p className="text-sm text-muted-foreground">
                Add customer details, service information, and required documents.
              </p>
            </div>
            <CustomerRecordWizard />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
