import React from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StatusIndicator({ count, total, color, label, statusKey }) {
  const linkTo = createPageUrl(`Programs?status=${statusKey}`);
  const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;

  return (
    <Link to={linkTo} className="block h-full">
      <Card className="relative overflow-hidden bg-white shadow-lg border-0 h-full hover:shadow-xl hover:border-blue-300 transition-all duration-300">
        <div className="p-4 text-center flex flex-col justify-between h-full">
          <div>
            <div className={`w-16 h-16 mx-auto rounded-full ${color} flex items-center justify-center mb-2`}>
              <span className="text-2xl font-bold text-white">{count}</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-base">{label}</h3>
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-700">{percentage}%</span>
            <p className="text-xs text-gray-500">מהסה״כ</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}