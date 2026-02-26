import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Party, Location, DocumentPreparer, DeedDraft } from '../backend';

// ─── Party Queries ───────────────────────────────────────────────────────────

export function useGetAllParties() {
  const { actor, isFetching } = useActor();
  return useQuery<Party[]>({
    queryKey: ['parties'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllParties();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddParty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (party: Party) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addParty(party);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}

export function useUpdateParty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (party: Party) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateParty(party);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}

export function useDeleteParty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteParty(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['parties'] }),
  });
}

// ─── Location Queries ─────────────────────────────────────────────────────────

export function useGetAllLocations() {
  const { actor, isFetching } = useActor();
  return useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLocations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addLocation(location);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  });
}

export function useUpdateLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (location: Location) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateLocation(location);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  });
}

export function useDeleteLocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteLocation(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  });
}

// ─── Document Preparer Queries ────────────────────────────────────────────────

export function useGetAllPreparers() {
  const { actor, isFetching } = useActor();
  return useQuery<DocumentPreparer[]>({
    queryKey: ['preparers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPreparers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPreparer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preparer: DocumentPreparer) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addPreparer(preparer);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['preparers'] }),
  });
}

export function useUpdatePreparer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (preparer: DocumentPreparer) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updatePreparer(preparer);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['preparers'] }),
  });
}

export function useDeletePreparer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deletePreparer(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['preparers'] }),
  });
}

// ─── Draft Queries ────────────────────────────────────────────────────────────

export function useGetAllDrafts() {
  const { actor, isFetching } = useActor();
  return useQuery<DeedDraft[]>({
    queryKey: ['drafts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDrafts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDraft(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DeedDraft | null>({
    queryKey: ['draft', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getDraft(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSaveDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: DeedDraft) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.saveDraft(draft);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drafts'] }),
  });
}

export function useUpdateDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: DeedDraft) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateDraft(draft);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drafts'] }),
  });
}

export function useDeleteDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteDraft(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['drafts'] }),
  });
}
