import LoadingSpinner from "@/components/loading"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"

interface PageProps {
  params: {
    name: string | string[] | undefined
  }
}

const CategoryPage = React.lazy(() => import("./category-page"))

const Page = ({ params }: PageProps) => {
  if (typeof params.name !== "string") return notFound()

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={"lg"} />
        </div>
      }
    >
      <CategoryPage categoryName={params.name} />
    </Suspense>
  )
}
export const runtime = "edge"
export default Page
