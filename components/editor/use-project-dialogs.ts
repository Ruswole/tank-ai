import { useCallback, useState } from "react";

export type ProjectDialogType = "create" | "rename" | "delete" | null;

export interface ProjectDialogTarget {
  id: string;
  name: string;
  slug: string;
}

export function useProjectDialogs() {
  const [dialogType, setDialogType] = useState<ProjectDialogType>(null);
  const [targetProject, setTargetProject] =
    useState<ProjectDialogTarget | null>(null);
  const [draftName, setDraftName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = useCallback(() => {
    setDialogType("create");
    setTargetProject(null);
    setDraftName("");
    setIsSubmitting(false);
  }, []);

  const openRename = useCallback((project: ProjectDialogTarget) => {
    setDialogType("rename");
    setTargetProject(project);
    setDraftName(project.name);
    setIsSubmitting(false);
  }, []);

  const openDelete = useCallback((project: ProjectDialogTarget) => {
    setDialogType("delete");
    setTargetProject(project);
    setDraftName(project.name);
    setIsSubmitting(false);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setTargetProject(null);
    setDraftName("");
    setIsSubmitting(false);
  }, []);

  const submit = useCallback(
    async (onSubmit: () => void | Promise<void>) => {
      setIsSubmitting(true);

      try {
        await onSubmit();
        closeDialog();
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeDialog],
  );

  return {
    dialogType,
    targetProject,
    draftName,
    setDraftName,
    isSubmitting,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submit,
  };
}
