import { Dialog } from "@headlessui/react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="bg-white rounded-xl p-6 z-10 w-80 space-y-4">
        <Dialog.Title className="text-lg font-semibold">Megerősítés</Dialog.Title>
        <Dialog.Description>{message}</Dialog.Description>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Mégse
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Igen
          </button>
        </div>
      </div>
    </Dialog>
  );
}

