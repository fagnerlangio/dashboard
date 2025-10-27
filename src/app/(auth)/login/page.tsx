"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import "./login.css";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const showErrorToast = (message?: string) => {
    if (message) {
      toast.error(message);
    }
  };

  useEffect(() => {
    showErrorToast(errors.email?.message);
    showErrorToast(errors.password?.message);
  }, [errors]);

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Verificando...");

    const success = await login(data.email, data.password);

    toast.dismiss(toastId);

    if (success) {
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } else {
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="email" placeholder="E-mail" {...register("email")} />

          <input
            type="password"
            placeholder="Senha"
            {...register("password")}
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
