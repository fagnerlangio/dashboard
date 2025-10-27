import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser, deleteUser } from "../services/userService";

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries(["users"]),
  });

  return { create, update, remove };
};