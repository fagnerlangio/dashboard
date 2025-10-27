import React, { useEffect } from "react";

type AlertProps = {
  type: "warning" | "success" | "error" | "info";
  message: string;
  onClose: () => void;
};

export default function Alert({ type, message, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    warning: "bg-yellow-400 text-black",
    success: "bg-green-500 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${colors[type]}`}
    >
      {message}
    </div>
  );
}
