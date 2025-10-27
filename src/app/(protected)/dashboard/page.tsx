"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { User } from "@/types/User";
import UserForm from "./../../components/UserForm"; 
import { useUserMutations } from "../../hooks/useUserMutations";
import { Plus, LogOut } from "lucide-react";
import "./DashboardPage.css";

interface UsersResponse {
  data: User[];   
  total: number;   
}

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);

  // A tipagem aqui garante que data e total existem e têm o tipo correto
  const { data, isLoading, error, isFetching } = useUsers(page) as {
    data?: UsersResponse;
    isLoading: boolean;
    error?: { message: string };
    isFetching: boolean;
  };

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { create, update, remove } = useUserMutations();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      await remove.mutateAsync(id);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Você está autenticado. Bem-vindo de volta!
        </p>
        <button onClick={logout} className="logout-button">
          <LogOut size={18} /> Sair da Conta
        </button>
      </div>

      {formOpen && (
        <UserForm
          initialData={editingUser}
          onClose={() => {
            setEditingUser(null);
            setFormOpen(false);
          }}
          onSubmit={async (formData) => {
            if (editingUser) {
              await update.mutateAsync({ id: editingUser.id, data: formData });
            } else {
              await create.mutateAsync(formData);
            }
            setFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      <div className="user-list-container">
        <div className="user-list-header">
          <h2 className="user-list-title">Usuários</h2>
          {!formOpen && (
            <button onClick={handleCreate} className="create-user-button">
              <Plus size={18} /> Novo Usuário
            </button>
          )}
        </div>

        {isLoading && (
          <div className="loading-text">Carregando usuários...</div>
        )}

        {error && <p className="error-text">Erro: {error.message}</p>}

        <ul>
          {data?.data.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="user-actions">
                <button onClick={() => handleEdit(user)} className="edit-button">
                  Editar
                </button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="pagination">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1 || isFetching}
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={isFetching || (data ? page * 5 >= data.total : true)}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
