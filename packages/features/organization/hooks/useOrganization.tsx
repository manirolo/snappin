"use client";

import { trpc } from "@snappin/features/trpc/react/client";
import { UpdateOrganizationInput } from "@snappin/features/trpc/router/organization/updateOrganization.handler";
import toast from "react-hot-toast";

export const useOrganization = () => {
  const utils = trpc.useUtils();

  const query = trpc.organization.getOrganization.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: 1,
  });

  const mutation = trpc.organization.updateOrganization.useMutation({
    onSuccess: () => {
      utils.organization.getOrganization.invalidate();
      toast.success("Workspace settings updated")
    },
    onError: () => {
      toast.error("Failed to update workspace settings")
    }
  });

  const updateOrganization = (input: UpdateOrganizationInput) => {
    return mutation.mutateAsync(input);
  };

  return {
    organization: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    updateOrganization,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};