"use client";

import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md" title={title}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm text-cinema-text">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cinema-border/40">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
