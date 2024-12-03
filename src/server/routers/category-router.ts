import { db } from "@/db"
import { router } from "../__internals/router"
import { privateProcedure } from "../procedures"
import { startOfDay, startOfMonth, startOfWeek } from "date-fns"
import { string, z } from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { parseColor } from "@/lib/utils"
import { HTTPException } from "hono/http-exception"

const categoryRouter = router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx

    const categories = await db.eventCategory.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const countEventCategories = await Promise.all(
      categories.map(async (category) => {
        const now = new Date()
        const firstOfMonth = startOfMonth(now)

        const categoryEvents = await db.event.findMany({
          where: {
            EventCategory: {
              id: category.id,
            },
            createdAt: {
              gte: firstOfMonth,
            },
          },
          select: {
            fields: true,
            createdAt: true,
          },
          distinct: ["fields"],
          orderBy: {
            createdAt: "desc",
          },
        })

        const fieldNames = new Set<string>()

        categoryEvents.forEach((event) => {
          Object.keys(event.fields as object).forEach((key) => {
            fieldNames.add(key)
          })
        })
        return {
          ...category,
          metadata: {
            count: categoryEvents.length,
            latest: categoryEvents[0]?.createdAt || null,
            fieldsCount: fieldNames.size,
          },
        }
      })
    )

    return c.superjson({ categories: countEventCategories })
  }),

  deleteEventCategory: privateProcedure
    .input(
      z.object({
        name: string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { name } = input
      const { user } = ctx

      await db.eventCategory.delete({
        where: {
          name_userId: {
            name,
            userId: user.id,
          },
        },
      })

      return c.json({ status: "success" })
    }),

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, "Color is required")
          .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
        emoji: z.string().emoji().optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { name, color, emoji } = input
      const { user } = ctx

      const newCategory = await db.eventCategory.create({
        data: {
          name,
          color: parseColor(color),
          emoji,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      })

      return c.json({ category: newCategory })
    }),

  createQuickstartEventCategories: privateProcedure.mutation(
    async ({ c, ctx }) => {
      const { user } = ctx

      const categories = await db.eventCategory.createMany({
        data: [
          {
            name: "Bug",
            color: parseColor("#FF6B6B"),
            emoji: "🪲",
          },
          {
            name: "Sale",
            color: parseColor("#FDCB6E"),
            emoji: "💰",
          },
          {
            name: "Question",
            color: parseColor("#2ECC71"),
            emoji: "🤔",
          },
        ].map((category) => ({
          ...category,
          userId: user.id,
        })),
      })

      return c.json({
        status: "success",
        count: categories.count,
      })
    }
  ),

  pollCategory: privateProcedure
    .input(z.object({ name: string() }))
    .query(async ({ c, ctx, input }) => {
      const { name } = input
      const { user } = ctx

      const category = await db.eventCategory.findUnique({
        where: {
          name_userId: {
            name,
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

      if (!category) {
        throw new HTTPException(404, { message: "Category not found" })
      }

      return c.json({
        status: "success",
        hasEvents: category._count.events > 0,
      })
    }),

  getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        limit: z.number().min(1).max(50),
        page: z.number().min(1),
        timeRange: z.enum(["today", "week", "month"]),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { name, limit, page, timeRange } = input
      const { user } = ctx

      let startDate: Date
      const now = new Date()
      switch (timeRange) {
        case "today":
          startDate = startOfDay(now)
          break
        case "week":
          startDate = startOfWeek(now)
          break
        case "month":
          startDate = startOfMonth(now)
          break
      }

      const events = await db.event.findMany({
        where: {
          EventCategory: {
            name,
            user: {
              id: user.id,
            },
          },
          createdAt: {
            gte: startDate,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      })

      const uniqueFieldNames = new Set<string>()

      events.forEach((event) => {
        Object.keys(event.fields as object).forEach((key) => {
          uniqueFieldNames.add(key)
        })
      })

      return c.superjson({
        events,
        eventsCount: events.length,
        uniqueFieldsCount: uniqueFieldNames.size,
      })
    }),
})

export default categoryRouter
