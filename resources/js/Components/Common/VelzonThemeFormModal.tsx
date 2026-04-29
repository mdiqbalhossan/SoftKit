import React, { useEffect, useMemo } from "react";
import { Alert, Modal } from "react-bootstrap";

export type VelzonThemeFormModalProps = {
    show: boolean;
    onHide: () => void;
    title: string;
    /**
     * Success alert under the header (Velzon Sign Up pattern).
     * Omitted → default notice. Pass a node to customize. `null` → no banner.
     */
    banner?: React.ReactNode | null;
    /** Pass `form.errors` — scrolls modal body to the first visible validation message. */
    validationErrors?: Record<string, string | undefined>;
    children: React.ReactNode;
};

/**
 * Velzon "Sign Up" style dialog: header (title + X), full-width success alert, body.
 * Put your `<Form>` inside `children` with a bottom-aligned primary action:
 * `<div className="text-end"><Button type="submit" variant="primary">…</Button></div>`
 */
export default function VelzonThemeFormModal({
    show,
    onHide,
    title,
    banner,
    validationErrors,
    children,
}: VelzonThemeFormModalProps) {
    const errorSignature = useMemo(() => {
        if (!validationErrors) return "";
        return Object.keys(validationErrors)
            .filter((k) => validationErrors[k])
            .sort()
            .join("|");
    }, [validationErrors]);

    useEffect(() => {
        if (!show || !errorSignature) return;

        const id = requestAnimationFrame(() => {
            const modalRoot = document.getElementById(
                "velzon-theme-form-modal",
            );
            const scrollParent =
                modalRoot?.querySelector<HTMLElement>(".modal-body") ??
                modalRoot?.querySelector<HTMLElement>(".modal-dialog");
            if (!scrollParent) return;

            const first =
                scrollParent.querySelector<HTMLElement>(".is-invalid") ??
                scrollParent.querySelector<HTMLElement>(".text-danger.small") ??
                scrollParent.querySelector<HTMLElement>(
                    '[aria-invalid="true"]',
                );

            first?.scrollIntoView({ block: "center", behavior: "smooth" });
        });

        return () => cancelAnimationFrame(id);
    }, [show, errorSignature]);

    return (
        <Modal
            id="velzon-theme-form-modal"
            show={show}
            onHide={onHide}
            centered
            scrollable
        >
            <Modal.Header className="p-3" closeButton>
                <h5 className="modal-title mb-0">{title}</h5>
            </Modal.Header>
            {banner !== null && (
                <Alert variant="success" className="rounded-0 mb-0 border-0">
                    {banner ?? (
                        <p className="mb-0">
                            Please complete all fields below. Required items are
                            validated on submit.
                        </p>
                    )}
                </Alert>
            )}
            <Modal.Body>{children}</Modal.Body>
        </Modal>
    );
}
