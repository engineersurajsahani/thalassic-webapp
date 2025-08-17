import * from "react";
import * from "@radix-ui/react-label";
import { cva} from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled-not-allowed peer-disabled-70",
);

const Label = React.forwardRef,
  React.ComponentPropsWithoutRef &
    VariantProps
>(({ className, ...props }, ref) => (
  
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
