import { AppSidebar } from "@/components/app-sidebar"
import AllCards from "@/components/dashboard/AllCards"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Page() {
 
  const { cookies } = await import("next/headers")
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
          <div className="flex flex-col items-center justify-center h-full">          
                      
                     
              {/* All Cards */}
              <AllCards />
           
          </div>
          
        </div>       
      </main>
    </SidebarLayout>
  )
}
