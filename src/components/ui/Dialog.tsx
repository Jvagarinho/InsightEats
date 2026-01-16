"use client";

import * as React from "react";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      {children}
    </div>
  );
}

type DialogHeaderProps = {
  children: React.ReactNode;
};

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="space-y-1 border-b border-gray-100 pb-3 mb-2">{children}</div>;
}

type DialogTitleProps = {
  children: React.ReactNode;
};

export function DialogTitle({ children }: DialogTitleProps) {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
}
