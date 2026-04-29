import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { confirmDeleteSwal } from "../../utils/deleteConfirmationSwal";

interface DeleteModalProps {
    show?: boolean;
    onDeleteClick?: () => void;
    onCloseClick?: () => void;
    recordId?: string;
}

/**
 * Controlled delete confirmation via SweetAlert2. When `show` flips to true, opens a confirm dialog.
 * On confirm, runs `onDeleteClick`; always calls `onCloseClick` after the dialog closes so parents can reset state.
 * Renders nothing — replaces the old Bootstrap modal for every consumer automatically.
 */
const DeleteModal = ({
    show,
    onDeleteClick,
    onCloseClick,
    recordId,
}: DeleteModalProps) => {
    const onDeleteRef = useRef(onDeleteClick);
    const onCloseRef = useRef(onCloseClick);

    onDeleteRef.current = onDeleteClick;
    onCloseRef.current = onCloseClick;

    const prevShowRef = useRef(false);

    useEffect(() => {
        const risingEdge = Boolean(show) && !prevShowRef.current;
        prevShowRef.current = Boolean(show);

        if (!risingEdge) {
            return;
        }

        let cancelled = false;

        void confirmDeleteSwal(recordId).then((confirmed) => {
            if (cancelled) {
                return;
            }
            if (confirmed) {
                onDeleteRef.current?.();
            }
            onCloseRef.current?.();
        });

        return () => {
            cancelled = true;
            Swal.close();
        };
    }, [show, recordId]);

    return null;
};

export default DeleteModal;
