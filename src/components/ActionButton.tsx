import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon | React.ReactNode | string;
  label: string;
  onClick: () => void;
  variant?: "default" | "accent";
}

const ActionButton = ({ icon, label, onClick, variant = "default" }: ActionButtonProps) => {
  const isElement = React.isValidElement(icon);
  const isComponent = typeof icon === "function" || (typeof icon === "object" && !!(icon as any)?.render);
  const isString = typeof icon === "string";

  return (
    <Button
      onClick={onClick}
      className={`flex-1 h-14 flex flex-row items-center justify-center gap-1 px-3 ${
        variant === "accent" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""
      }`}
      variant={variant === "default" ? "default" : undefined}
    >
      <div className="flex items-center justify-center w-10 h-10">
        {isElement ? (
          icon as React.ReactNode
        ) : isComponent ? (
          React.createElement(icon as React.ComponentType<any>, { className: "w-10 h-10" })
        ) : isString ? (
          <img src={icon as string} alt={label} className="w-10 h-10 object-contain" />
        ) : (
          // fallback: render as-is
          icon as React.ReactNode
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
};

export default ActionButton;
