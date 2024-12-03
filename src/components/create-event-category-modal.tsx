"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { HTMLAttributes, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator"
import { Modal } from "./ui/modal"
import Heading from "./heading"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { client } from "@/app/lib/client"
import LoadingSpinner from "./loading"

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string()
    .min(1, "Color is required")
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color"),
  emoji: z.string().emoji().optional(),
})

type EventCategoryForm = z.infer<typeof EVENT_CATEGORY_VALIDATOR>

const COLOR_OPTIONS = [
  "#FF6B6B", // bg-[#FF6B6B] ring-[#FF6B6B] Bright Red
  "#4ECDC4", // bg-[#4ECDC4] ring-[#4ECDC4] Teal
  "#45B7D1", // bg-[#45B7D1] ring-[#45B7D1] Sky Blue
  "#FFA07A", // bg-[#FFA07A] ring-[#FFA07A] Light Salmon
  "#98D8C8", // bg-[#98D8C8] ring-[#98D8C8] Seafoam Green
  "#FDCB6E", // bg-[#FDCB6E] ring-[#FDCB6E] Mustard Yellow
  "#6C5CE7", // bg-[#6C5CE7] ring-[#6C5CE7] Soft Purple
  "#FF85A2", // bg-[#FF85A2] ring-[#FF85A2] Pink
  "#2ECC71", // bg-[#2ECC71] ring-[#2ECC71] Emerald Green
  "#E17055", // bg-[#E17055] ring-[#E17055] Terracotta
]

const EMOJI_OPTIONS = [
  { emoji: "💰", label: "Money (Sale)" },
  { emoji: "👤", label: "User (Sign-up)" },
  { emoji: "🎉", label: "Celebration" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "🚀", label: "Launch" },
  { emoji: "📢", label: "Announcement" },
  { emoji: "🎓", label: "Graduation" },
  { emoji: "🏆", label: "Achievement" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔔", label: "Notification" },
]

interface CreateEventCategoryModalProps extends HTMLAttributes<HTMLDivElement> {
  containerClassName?: string
}
const CreateEventCategoryModal = ({
  containerClassName,
  children,
}: CreateEventCategoryModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventCategoryForm>({
    resolver: zodResolver(EVENT_CATEGORY_VALIDATOR),
  })

  const [isOpen, setIsOpen] = useState(false)
  const currentColor = watch("color")
  const currentEmoji = watch("emoji")
  const queryClient = useQueryClient()

  const { mutate: createEventCategory, isPending: isCreatingEventCategory } =
    useMutation({
      mutationFn: async (category: EventCategoryForm) => {
        const response = await client.category.createEventCategory.$post(
          category
        )
        return await response.json()
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user-event-category"] })
        setIsOpen(false)
        reset()
      },
    })

  const handleFormSubmit = (data: EventCategoryForm) => {
    createEventCategory(data)
  }
  return (
    <>
      <div className={containerClassName} onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <Modal
        className="max-w-xl p-8"
        showModal={isOpen}
        setShowModal={setIsOpen}
      >
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <h2 className=" text-lg/7 font-medium tracking-tight text-secondary-foreground/80">
              Create New Event Category
            </h2>
            <p className="text-sm/6 text-muted-foreground ">
              Create a new event category to organize and track your events.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                autoFocus
                placeholder="e.g. User-Signup"
                className="w-full mt-2"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2 mt-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    className={cn(
                      "w-10 h-10 rounded-full cursor-pointer transition-all duration-200",
                      color === currentColor &&
                        "ring-2 ring-ring scale-110 ring-offset-1 ring-offset-background"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setValue("color", color)}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="color">Emoji</Label>
              <div className="flex gap-2 mt-2">
                {EMOJI_OPTIONS.map(({ emoji, label }) => (
                  <button
                    type="button"
                    key={emoji}
                    className={cn(
                      "w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 bg-muted ",
                      emoji === currentEmoji &&
                        "ring-2 ring-ring scale-110 ring-offset-1 ring-offset-background"
                    )}
                    onClick={() => setValue("emoji", emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.emoji && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.emoji.message}
                </p>
              )}
            </div>
            <div className="flex border-t pt-4 gap-2 justify-end">
              <Button
                type="button"
                variant={"secondary"}
                onClick={() => {
                  reset()
                  setIsOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingEventCategory}>
                {isCreatingEventCategory ? (
                  <>
                    Creating... <LoadingSpinner />
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}
export default CreateEventCategoryModal
