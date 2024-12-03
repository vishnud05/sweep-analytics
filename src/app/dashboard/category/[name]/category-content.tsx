"use client"
import { EventCategory } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { EmptyCategoryState } from "./empty-category-state"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { client } from "@/app/lib/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Card from "@/components/ui/card"
import { BarChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns"

interface CategoryContentProps {
  hasEvents: boolean
  category: EventCategory
}

const CategoryContent = ({
  hasEvents: initialHasEvents,
  category,
}: CategoryContentProps) => {
  const searchParams = useSearchParams()

  const [pagination, setPagination] = useState({
    pageIndex: parseInt(searchParams.get("page") ?? "1"),
    pageSize: parseInt(searchParams.get("limit") ?? "10"),
  })
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">(
    "today"
  )

  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: {
      hasEvents: initialHasEvents,
    },
  })

  const { data, isFetching } = useQuery({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      timeRange,
    ],
    queryFn: async () => {
      const response = await client.category.getEventsByCategoryName.$get({
        name: category.name,
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        timeRange,
      })
      return await response.json()
    },
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  })

  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("page", pagination.pageIndex.toString())
    searchParams.set("limit", pagination.pageSize.toString())
    router.push(`?${searchParams.toString()}`, { scroll: false })
  }, [pagination, router])

  const numericFieldSums = useMemo(() => {
    if (!data?.events || data.events.length === 0) return {}

    const sums: Record<
      string,
      {
        total: number
        thisWeek: number
        thisMonth: number
        today: number
      }
    > = {}

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 0 })
    const monthStart = startOfMonth(now)

    data.events.forEach((event) => {
      const eventDate = event.createdAt

      Object.entries(event.fields as object).forEach(([field, value]) => {
        if (typeof value === "number") {
          if (!sums[field]) {
            sums[field] = { total: 0, thisWeek: 0, thisMonth: 0, today: 0 }
          }

          sums[field].total += value

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[field].thisWeek += value
          }

          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value
          }

          if (isToday(eventDate)) {
            sums[field].today += value
          }
        }
      })
    })

    return sums
  }, [data?.events])

  const NumericFieldSumCards = () => {
    if (Object.keys(numericFieldSums).length === 0) return null

    return Object.entries(numericFieldSums).map(([field, sums]) => {
      const relevantSum =
        timeRange === "today"
          ? sums.today
          : timeRange === "week"
          ? sums.thisWeek
          : sums.thisMonth

      return (
        <Card key={field}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>

          <div>
            <p className="text-2xl font-bold">{relevantSum.toFixed(2)}</p>
            <p className="text-xs/5 text-muted-foreground">
              {timeRange === "today"
                ? "today"
                : timeRange === "week"
                ? "this week"
                : "this month"}
            </p>
          </div>
        </Card>
      )
    })
  }

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={timeRange}
        onValueChange={(value) =>
          setTimeRange(value as "today" | "week" | "month")
        }
      >
        <TabsList className="mb-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value={timeRange}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-brand-700">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold">{data?.eventsCount || 0}</p>
                <p className="text-xs/5 text-muted-foreground">
                  Events{" "}
                  {timeRange === "today"
                    ? "today"
                    : timeRange === "week"
                    ? "this week"
                    : "this month"}
                </p>
              </div>
            </Card>
            <NumericFieldSumCards />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default CategoryContent
