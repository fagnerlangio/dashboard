import { useQuery } from "@tanstack/react-query";

export const fetchUsers = async (page: number) => {
  const res = await fetch(`http://localhost:3001/users?_page=${page}&_limit=5`);
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  const total = res.headers.get("X-Total-Count");
  const data = await res.json();
  return { data, total: Number(total) };
};

export const useUsers = (page: number) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page),
    keepPreviousData: true, // mantém dados antigos enquanto carrega os novos
  });
};
