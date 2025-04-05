import React from "react";
import { Card } from "@/components/ui/card";

export default function StatCard({
  title,
  quantity,
  value,
  className,
}: {
  title: string;
  quantity: number;
  value: number;
  className?: string;
}) {
  return (
    <Card className={`p-4 ${className}`}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-2">
        <p className="text-white">
          Quantity: <span className="font-medium">{quantity}</span>
        </p>
        <p className="text-white">
          Value: <span className="font-medium">Rs. {value.toFixed(2)}</span>
        </p>
      </div>
    </Card>
  );
}
