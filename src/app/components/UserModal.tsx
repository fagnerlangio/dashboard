"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/User";

const userSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF obrigatório"),
  birthDate: z.string().min(10, "Data obrigatória"),
});

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: User | null;
}

export default function UserModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", email: "", cpf: "", birthDate: "" });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{initialData ? "Editar Usuário" : "Novo Usuário"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input placeholder="Nome" {...register("name")} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

          <input placeholder="Email" {...register("email")} className="w-full p-2 border rounded" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

          <input placeholder="CPF" {...register("cpf")} className="w-full p-2 border rounded" />
          {errors.cpf && <p className="text-red-600 text-sm">{errors.cpf.message}</p>}

          <input type="date" {...register("birthDate")} className="w-full p-2 border rounded" />
          {errors.birthDate && <p className="text-red-600 text-sm">{errors.birthDate.message}</p>}

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}