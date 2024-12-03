import DashboardPage from "@/components/dashboard-page"
import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import CategoryContent from "./category-content"

interface CategoryPageProps {
  categoryName: string
}

const CategoryPage = async ({ categoryName }: CategoryPageProps) => {
  const auth = await currentUser()
  if (!auth) return notFound()

  const user = await db.user.findUnique({
    where: {
      externalId: auth.id,
    },
  })
  if (!user) return notFound()

  const category = await db.eventCategory.findUnique({
    where: {
      name_userId: {
        name: categoryName,
        userId: user.id,
      },
    },
    include: {
      _count: {
        select: {
          events: true,
        },
      },
    },
  })
  if (!category) return notFound()

  return (
    <DashboardPage title={`${category.emoji} ${category.name}`}>
      <CategoryContent
        category={category}
        hasEvents={category._count.events > 0}
      />
    </DashboardPage>
  )
}
export default CategoryPage
