import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import {  } from "class-variance-authority"
import { cn } from "@/lib/utils.js"
import { toggleVariants } from "@/components/ui/toggle.jsx"
const ToggleGroupContext = React.createContext<
  
>({
  size: "default",
  variant: "default",
})
React.forwardRef((  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName
React.forwardRef((  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName
export { ToggleGroup, ToggleGroupItem }
