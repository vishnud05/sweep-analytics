import { DiscordClient } from "@/app/lib/discord-client"
import { FREE_QUOTA, PRO_QUOTA } from "@/config"
import { db } from "@/db"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const EVENT_INPUT_VALIDATOR = z
  .object({
    category: z.string(),
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict()

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized. Check your API key.",
        },
        {
          status: 401,
        }
      )
    }
    const apiKey = authHeader.split(" ")[1]
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid API key.",
        },
        {
          status: 401,
        }
      )
    }
    const user = await db.user.findUnique({
      where: {
        apiKey,
      },
      include: {
        EventCategories: true,
      },
    })
    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid API key.",
        },
        {
          status: 401,
        }
      )
    }
    if (!user.discordId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Please connect your Discord account to use this API.",
        },
        {
          status: 403,
        }
      )
    }

    const currentData = new Date()
    const currentMonth = currentData.getMonth() + 1
    const currentYear = currentData.getFullYear()

    const quota = await db.quota.findUnique({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    })

    const quotaLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth

    if (quota && quota.count >= quotaLimit) {
      return NextResponse.json(
        {
          message:
            "Monthly quota reached. Please upgrade your plan for more events",
        },
        { status: 429 }
      )
    }

    let reqData: unknown
    try {
      reqData = await req.json()
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid JSON request body",
        },
        { status: 400 }
      )
    }

    const validationResult = EVENT_INPUT_VALIDATOR.parse(reqData)

    const category = user.EventCategories.find(
      (cat) => cat.name === validationResult.category
    )
    if (!category) {
      return NextResponse.json(
        {
          message: `You dont have a category named "${validationResult.category}"`,
        },
        { status: 404 }
      )
    }

    const eventData = {
      title: `${category.emoji || "🔔"} ${
        category.name.charAt(0).toUpperCase() + category.name.slice(1)
      }`,
      description:
        validationResult.description ||
        `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(
        ([key, value]) => {
          return {
            name: key,
            value: String(value),
            inline: true,
          }
        }
      ),
    }

    const event = await db.event.create({
      data: {
        name: category.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.fields || {},
        eventCategoryId: category.id,
      },
    })

    try {
      const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN)

      const dmChannel = await discord.createDM(user.discordId)
      await discord.sendEmbed(dmChannel.id, eventData)

      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "DELIVERED" },
      })

      console.log(`Event ${event.id} sent to Discord`)

      await db.quota.upsert({
        update: { count: { increment: 1 } },
        create: {
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        },
        where: {
          userId_month_year: {
            year: currentYear,
            month: currentMonth,
            userId: user.id,
          },
        },
      })
    } catch (err) {
      await db.event.update({
        where: { id: event.id },
        data: { deliveryStatus: "FAILED" },
      })

      console.log(err)

      return NextResponse.json(
        {
          message: "Error processing event",
          eventId: event.id,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Event processed successfully",
      eventId: event.id,
    })
  } catch (err) {
    console.error(err)

    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.message }, { status: 422 })
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
