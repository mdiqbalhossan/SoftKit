import React, { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import {
    toast,
    ToastContainer,
    type ToastContainerProps,
} from "react-toastify";

export type VelzonToastIntent =
    | "created"
    | "updated"
    | "deleted"
    | "restored"
    | "login"
    | "logout"
    | "error"
    | "warning"
    | "info"
    | "generic";

const INTENT_ICONS: Record<VelzonToastIntent, string> = {
    created: "ri-add-circle-line",
    updated: "ri-pencil-fill",
    deleted: "ri-delete-bin-5-line",
    restored: "ri-restart-line",
    login: "ri-login-circle-line",
    logout: "ri-logout-circle-r-line",
    error: "ri-close-circle-line",
    warning: "ri-alert-line",
    info: "ri-information-line",
    generic: "ri-checkbox-circle-fill",
};

const INTENT_VARIANT: Record<
    VelzonToastIntent,
    "primary" | "success" | "warning" | "danger"
> = {
    created: "success",
    updated: "success",
    deleted: "danger",
    restored: "success",
    login: "success",
    logout: "primary",
    error: "danger",
    warning: "warning",
    info: "primary",
    generic: "success",
};

function ToastBody({
    message,
    iconClass,
}: {
    message: string;
    iconClass: string;
}) {
    return (
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-2">
                <i className={`${iconClass} align-middle fs-18`} aria-hidden />
            </div>
            <div className="flex-grow-1">
                <h6 className="mb-0 fw-medium">{message}</h6>
            </div>
        </div>
    );
}

export type ShowVelzonToastOptions = {
    intent: VelzonToastIntent;
    message: string;
    /** Override automatic variant from intent */
    variant?: "primary" | "success" | "warning" | "danger";
};

/**
 * Velzon “Bordered with Icon” style for react-toastify (matches UiNotifications demo).
 * Primary uses theme color (#F54927).
 */
export function showVelzonToast(opts: ShowVelzonToastOptions) {
    const variant = opts.variant ?? INTENT_VARIANT[opts.intent];
    const iconClass = INTENT_ICONS[opts.intent];
    const className = `velzon-toastify overflow-hidden toast-border-${variant}`;

    toast(<ToastBody message={opts.message} iconClass={iconClass} />, {
        className,
        icon: false,
        hideProgressBar: true,
        closeOnClick: true,
        autoClose: 4000,
    });
}

/** Map typical demo-app success copy to the right icon */
export function inferIntentFromMessage(message: string): VelzonToastIntent {
    const m = message.toLowerCase();
    if (m.includes("restored")) {
        return "restored";
    }
    if (
        m.includes("trash") ||
        m.includes("archived") ||
        m.includes("deleted") ||
        m.includes("delete ")
    ) {
        return "deleted";
    }
    if (m.includes("updated") || m.includes("saved")) {
        return "updated";
    }
    if (m.includes("created") || m.includes("added successfully")) {
        return "created";
    }
    if (m.includes("log in") || m.includes("login") || m.includes("welcome")) {
        return "login";
    }
    return "generic";
}

export function velzonNotifySuccess(message: string) {
    showVelzonToast({ intent: inferIntentFromMessage(message), message });
}

export function velzonNotifyError(message: string) {
    showVelzonToast({ intent: "error", message });
}

export const velzonToastContainerProps: ToastContainerProps = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    theme: "light",
    icon: false,
};

export function GlobalVelzonToastContainer() {
    return <ToastContainer {...velzonToastContainerProps} />;
}

/**
 * Show server flash.success / flash.error with bordered icons (include in main + guest layouts).
 */
export function FlashVelzonToasts() {
    const { flash }: any = usePage().props;
    const lastSuccess = useRef<string | null>(null);
    const lastError = useRef<string | null>(null);

    useEffect(() => {
        const s = flash?.success as string | undefined;
        if (s && s !== lastSuccess.current) {
            lastSuccess.current = s;
            showVelzonToast({ intent: inferIntentFromMessage(s), message: s });
        }
    }, [flash?.success]);

    useEffect(() => {
        const e = flash?.error as string | undefined;
        if (e && e !== lastError.current) {
            lastError.current = e;
            showVelzonToast({ intent: "error", message: e });
        }
    }, [flash?.error]);

    return null;
}

/** One toast per distinct validation payload (first message shown). */
export function useVelzonToastFromValidationErrors(
    errors: Record<string, string | undefined>,
) {
    const lastKey = useRef("");
    const signature = JSON.stringify(errors);

    useEffect(() => {
        const parsed = JSON.parse(signature) as Record<
            string,
            string | undefined
        >;
        const entries = Object.entries(parsed).filter(
            ([, v]) => typeof v === "string" && (v as string).length > 0,
        ) as [string, string][];
        if (!entries.length) {
            return;
        }
        const key = entries
            .map(([k, v]) => `${k}:${v}`)
            .sort()
            .join("|");
        if (key === lastKey.current) {
            return;
        }
        lastKey.current = key;
        showVelzonToast({ intent: "error", message: entries[0][1] });
    }, [signature]);
}

/** Status messages from auth pages (e.g. reset link sent, email verified). */
export function useVelzonToastFromStatus(
    status: string | undefined,
    intent: VelzonToastIntent = "generic",
) {
    const last = useRef("");
    useEffect(() => {
        if (!status || status === last.current) {
            return;
        }
        last.current = status;
        showVelzonToast({ intent, message: status });
    }, [status, intent]);
}
