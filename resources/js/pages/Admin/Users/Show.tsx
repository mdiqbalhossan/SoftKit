import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../../Layouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

type RoleOpt = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
};

type UserShow = {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    avatar: string | null;
    avatar_url: string;
    phone: string | null;
    bio: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    role?: RoleOpt | null;
};

function formatWhen(iso: string) {
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return iso;
    }
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="border-bottom border-bottom-dashed py-3">
            <Row className="g-2">
                <Col sm={4} className="text-muted small">
                    {label}
                </Col>
                <Col sm={8} className="fw-medium">
                    {children}
                </Col>
            </Row>
        </div>
    );
}

function UsersShow(props: { user: UserShow }) {
    const { user } = props;

    return (
        <React.Fragment>
            <Head title={`${user.name} | User`} />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        title="User details"
                        pageTitle="Administration"
                    />
                    <Row className="justify-content-center">
                        <Col xl={8}>
                            <Card>
                                <Card.Header className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-0">
                                    <div>
                                        <h5 className="card-title mb-0">
                                            Profile
                                        </h5>
                                        <p className="text-muted small mb-0">
                                            Read-only details for this account.
                                        </p>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link
                                            href={route("admin.users.index")}
                                            className="btn btn-soft-primary btn-sm"
                                        >
                                            <i className="ri-edit-2-line me-1"></i>
                                            Edit on users list
                                        </Link>
                                        <Link
                                            href={route("admin.users.index")}
                                            className="btn btn-soft-secondary btn-sm"
                                        >
                                            <i className="ri-arrow-left-line me-1"></i>
                                            Back to users
                                        </Link>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="mb-4">
                                        <Col
                                            sm={3}
                                            className="text-center text-sm-start"
                                        >
                                            <img
                                                src={user.avatar_url}
                                                alt=""
                                                className="rounded-circle mb-2 border"
                                                height="120"
                                                width="120"
                                                style={{ objectFit: "cover" }}
                                            />
                                            {user.deleted_at && (
                                                <div>
                                                    <span className="badge bg-danger-subtle text-danger">
                                                        Archived
                                                    </span>
                                                </div>
                                            )}
                                        </Col>
                                        <Col sm={9}>
                                            <DetailRow label="Name">
                                                {user.name}
                                            </DetailRow>
                                            <DetailRow label="Email">
                                                <a
                                                    href={`mailto:${user.email}`}
                                                >
                                                    {user.email}
                                                </a>
                                            </DetailRow>
                                            <DetailRow label="Role">
                                                {user.role?.name ?? (
                                                    <span className="text-muted fw-normal">
                                                        —
                                                    </span>
                                                )}
                                            </DetailRow>
                                            <DetailRow label="Phone">
                                                {user.phone ? (
                                                    <a
                                                        href={`tel:${user.phone}`}
                                                    >
                                                        {user.phone}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted fw-normal">
                                                        —
                                                    </span>
                                                )}
                                            </DetailRow>
                                            <DetailRow label="Bio">
                                                {user.bio ? (
                                                    <span className="fw-normal text-body">
                                                        {user.bio}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted fw-normal">
                                                        —
                                                    </span>
                                                )}
                                            </DetailRow>
                                            <DetailRow label="Created">
                                                {formatWhen(user.created_at)}
                                            </DetailRow>
                                            <DetailRow label="Last updated">
                                                {formatWhen(user.updated_at)}
                                            </DetailRow>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

UsersShow.layout = (page: any) => <Layout children={page} />;
export default UsersShow;
