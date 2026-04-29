import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, router } from "@inertiajs/react";
import ExportCSVModal from "./ExportCSVModal";

export function useInertiaListLoading(): boolean {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const offStart = router.on("start", () => setLoading(true));
        const offFinish = router.on("finish", () => setLoading(false));
        return () => {
            offStart();
            offFinish();
        };
    }, []);
    return loading;
}

type AdminListToolbarProps = {
    routeName: string;
    trashed?: boolean;
    search: string;
    searchPlaceholder: string;
    onExportClick: () => void;
};

/** Velzon-style dashed toolbar: server-side search (debounced) + export trigger */
export function AdminListToolbar({
    routeName,
    trashed = false,
    search: serverSearch,
    searchPlaceholder,
    onExportClick,
}: AdminListToolbarProps) {
    const [q, setQ] = useState(serverSearch ?? "");
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (document.activeElement === searchInputRef.current) return;
        setQ(serverSearch ?? "");
    }, [serverSearch]);

    useEffect(() => {
        const trimmedServer = (serverSearch ?? "").trim();
        const t = setTimeout(() => {
            const next = q.trim();
            if (next === trimmedServer) return;
            router.get(
                route(routeName, {
                    trashed: trashed ? 1 : undefined,
                    search: next || undefined,
                    page: 1,
                }),
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 400);
        return () => clearTimeout(t);
    }, [q, routeName, serverSearch, trashed]);

    return (
        <Row className="mb-3">
            <Card.Body className="border border-dashed border-end-0 border-start-0">
                <Row className="align-items-center gy-2">
                    <Col md={7} lg={8}>
                        <div className="search-box">
                            <Form.Control
                                ref={searchInputRef}
                                type="search"
                                className="form-control search"
                                placeholder={searchPlaceholder}
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                autoComplete="off"
                            />
                            <i className="bx bx-search-alt search-icon"></i>
                        </div>
                    </Col>
                    <Col md={5} lg={4} className="text-md-end">
                        <Button
                            type="button"
                            variant="outline-primary"
                            className="btn btn-outline-primary"
                            onClick={onExportClick}
                        >
                            <i className="ri-file-download-line align-bottom me-1"></i>
                            Export
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Row>
    );
}

type LaravelLink = { url: string | null; label: string; active: boolean };

type AdminPaginationProps = {
    links: LaravelLink[] | undefined;
    from: number | null | undefined;
    to: number | null | undefined;
    total: number;
};

/** Velzon pagination row + “Showing …” (Laravel LengthAwarePaginator links) */
export function AdminPaginationFooter({
    links,
    from,
    to,
    total,
}: AdminPaginationProps) {
    if (!total) return null;

    return (
        <Row className="align-items-center mt-3 g-3 text-center text-sm-start">
            <Col sm>
                <div className="text-muted">
                    Showing{" "}
                    <span className="fw-semibold ms-1">{from ?? 0}</span> to{" "}
                    <span className="fw-semibold">{to ?? 0}</span> of{" "}
                    <span className="fw-semibold">{total}</span> results
                </div>
            </Col>
            {links && links.length > 0 && (
                <Col sm="auto">
                    <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-end mb-0">
                        {links.map((l, i) => (
                            <li
                                key={i}
                                className={`page-item ${l.active ? "active" : ""} ${!l.url ? "disabled" : ""}`}
                            >
                                {l.url ? (
                                    <Link
                                        className="page-link"
                                        href={l.url}
                                        preserveScroll
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: l.label,
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <span
                                        className="page-link"
                                        dangerouslySetInnerHTML={{
                                            __html: l.label,
                                        }}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </Col>
            )}
        </Row>
    );
}

type AdminEmptyStateProps = {
    title: string;
    description: string;
};

/** Velzon “noresult” block (see theme list pages) */
export function AdminTableEmptyState({
    title,
    description,
}: AdminEmptyStateProps) {
    return (
        <div className="noresult py-5">
            <div className="text-center px-2">
                <i className="ri-inbox-line display-5 text-primary"></i>
                <h5 className="mt-3">{title}</h5>
                <p
                    className="text-muted mb-0 mx-auto"
                    style={{ maxWidth: 420 }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}

type AdminLoadingOverlayProps = {
    show: boolean;
    children: React.ReactNode;
};

export function AdminLoadingOverlay({
    show,
    children,
}: AdminLoadingOverlayProps) {
    return (
        <div className="position-relative">
            {show && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded"
                    style={{
                        zIndex: 3,
                        minHeight: 120,
                        background: "rgba(255,255,255,0.65)",
                    }}
                >
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading</span>
                    </Spinner>
                </div>
            )}
            {children}
        </div>
    );
}

type AdminExportCsvModalProps = {
    show: boolean;
    onClose: () => void;
    /** Rows as plain objects for react-csv (column labels = keys) */
    data: Record<string, string>[];
};

export function AdminExportCsvModal({
    show,
    onClose,
    data,
}: AdminExportCsvModalProps) {
    return <ExportCSVModal show={show} onCloseClick={onClose} data={data} />;
}
