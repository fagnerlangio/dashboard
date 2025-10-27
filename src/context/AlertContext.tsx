"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Tipos
type AlertType = "warning" | "success" | "error" | "info";

type AlertContextType = {
  showAlert: (type: AlertType, message: string) => void;
};

// Criando o contexto
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// ✅ Componente Alert embutido aqui
function Alert({
  type,
  message,
  onClose,
}: {
  type: AlertType;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    warning: "bg-yellow-400 text-black",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 ${colors[type]}`}
    >
      {message}
    </div>
  );
}

// Provedor
export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);

  const showAlert = (type: AlertType, message: string) => {
    setAlert({ type, message });
  };

  const closeAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
      {children}
    </AlertContext.Provider>
  );
}

// Hook para usar o alerta
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert deve ser usado dentro de AlertProvider");
  }
  return context;
}
