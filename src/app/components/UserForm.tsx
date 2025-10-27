"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/User";
import "./UserForm.css";

const userSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF obrigatório"),
  birthDate: z.string().min(10, "Data obrigatória"),
});

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: User | null;
}

export default function UserForm({ onClose, onSubmit, initialData }: Props) {
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

  return (
    <div className="user-form-container">
      <h2>{initialData ? "Editar Usuário" : "Novo Usuário"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Nome"
          {...register("name")}
          className="user-form-input"
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}

        <input
          placeholder="Email"
          {...register("email")}
          className="user-form-input"
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}

        <input
          placeholder="CPF"
          {...register("cpf")}
          className="user-form-input"
        />
        {errors.cpf && <p className="form-error">{errors.cpf.message}</p>}

        <input
          type="date"
          {...register("birthDate")}
          className="user-form-input"
        />
        {errors.birthDate && <p className="form-error">{errors.birthDate.message}</p>}

        <div className="user-form-buttons">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button type="submit" className="save-button">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
