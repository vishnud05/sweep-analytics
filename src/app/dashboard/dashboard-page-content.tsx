"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { client } from "../lib/client"
import LoadingSpinner from "@/components/loading"
import { ArrowRight, BarChart2, Clock, Database, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { format, formatDistanceToNow } from "date-fns"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import { cn } from "@/lib/utils"
import DashboardEmptyState from "./dashboard-empty-state"

const DashboardPageContent = () => {
  const queryClient = useQueryClient()
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null)

  const { data: categories, isPending } = useQuery({
    queryKey: ["user-event-category"],
    queryFn: async () => {
      const response = await client.category.getEventCategories.$get()
      const { categories } = await response.json()
      return categories
    },
  })

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useMutation(
    {
      mutationFn: async (name: string) => {
        await client.category.deleteEventCategory.$post({ name })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-event-category"] })
        setDeletingCategory(null)
      },
    }
  )

  if (isPending) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-1">
        <LoadingSpinner size={"lg"} />
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <DashboardEmptyState />
  }

  return (
    <>
      <ul className="grid max-w-6xl grid-cols-1 lg:grid-cols-2 xl:grid-cols-3  gap-6 ">
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative group z-10 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="absolute z-0 inset-px rounded-lg bg-gradient-to-br from-transparent via-background to-primary/10" />

            <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md ring-1 ring-ring/30" />

            <div className="relative p-6 z-10">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={cn(
                    "size-12 rounded-full bg-muted flex items-center justify-center text-2xl",
                    category.color &&
                      category.color.toString(16).padStart(6, "0")
                  )}
                >
                  {category.emoji || "📂"}
                </div>

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight ">
                    {category.name}
                  </h3>
                  <p className="text-sm/6 text-gray-500">
                    {format(category.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm/5 text-muted-foreground">
                  <Clock className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Last ping:</span>
                  <span className="ml-1">
                    {category.metadata.latest
                      ? formatDistanceToNow(category.metadata.latest) + " ago"
                      : "Never"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-muted-foreground">
                  <Database className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Unique fields:</span>
                  <span className="ml-1">
                    {category.metadata.fieldsCount || 0}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-muted-foreground">
                  <BarChart2 className="size-4 mr-2 text-brand-500" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{category.metadata.count || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Link
                  href={`/dashboard/category/${category.name}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  View all <ArrowRight className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className=" hover:text-red-600 transition-colors border dark:hover:text-red-600"
                  aria-label={`Delete ${category.name} category`}
                  onClick={() => setDeletingCategory(category.name)}
                >
                  <Trash2 className="size-5" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        showModal={!!deletingCategory}
        setShowModal={() => setDeletingCategory(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 items-start">
            <h2 className="text-lg/7 font-medium tracking-tight text-red-600">
              Delete Category
            </h2>
            <p className="text-sm/6 text-muted-foreground">
              Are you sure you want to delete the category &quot;
              {deletingCategory}&quot;? This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingCategory && deleteCategory(deletingCategory)
              }
              disabled={isDeletingCategory}
            >
              {isDeletingCategory ? (
                <>
                  Deleting... <LoadingSpinner size={"sm"} />{" "}
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
export default DashboardPageContent
