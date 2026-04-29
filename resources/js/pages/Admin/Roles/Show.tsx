import React from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../../Layouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

type UserMini = {
    id: number;
    name: string;
    email: string;
    deleted_at: string | null;
};

type RoleDetail = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    users: UserMini[];
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

function RolesShow(props: { role: RoleDetail }) {
    const { role } = props;

    return (
        <React.Fragment>
            <Head title={`${role.name} | Role`} />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        title="Role details"
                        pageTitle="Administration"
                    />
                    <Row className="justify-content-center">
                        <Col xl={10}>
                            <Card>
                                <Card.Header className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-0">
                                    <div>
                                        <h5 className="card-title mb-0">
                                            Role
                                        </h5>
                                        <p className="text-muted small mb-0">
                                            Read-only definition and assigned
                                            users.
                                        </p>
                                        {role.deleted_at && (
                                            <span className="badge bg-danger-subtle text-danger mt-2">
                                                Archived
                                            </span>
                                        )}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Link
                                            href={route("admin.roles.index")}
                                            className="btn btn-soft-primary btn-sm"
                                        >
                                            <i className="ri-edit-2-line me-1"></i>
                                            Edit on roles list
                                        </Link>
                                        <Link
                                            href={route("admin.roles.index")}
                                            className="btn btn-soft-secondary btn-sm"
                                        >
                                            <i className="ri-arrow-left-line me-1"></i>
                                            Back to roles
                                        </Link>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row className="g-4">
                                        <Col lg={7}>
                                            <DetailRow label="Display name">
                                                {role.name}
                                            </DetailRow>
                                            <DetailRow label="Slug">
                                                <code className="small">
                                                    {role.slug}
                                                </code>
                                            </DetailRow>
                                            <DetailRow label="Description">
                                                {role.description ? (
                                                    <span className="fw-normal text-body text-break d-block">
                                                        {role.description}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted fw-normal">
                                                        —
                                                    </span>
                                                )}
                                            </DetailRow>
                                            <DetailRow label="Created">
                                                {formatWhen(role.created_at)}
                                            </DetailRow>
                                            <DetailRow label="Last updated">
                                                {formatWhen(role.updated_at)}
                                            </DetailRow>
                                        </Col>
                                        <Col lg={5}>
                                            <Card className="border shadow-none bg-light bg-opacity-50">
                                                <Card.Header className="bg-transparent border-0 pb-0">
                                                    <h6 className="mb-0">
                                                        Assigned users
                                                    </h6>
                                                    <p className="text-muted small mb-0">
                                                        Includes archived
                                                        members for auditing.
                                                    </p>
                                                </Card.Header>
                                                <Card.Body className="pt-3">
                                                    <div className="table-responsive">
                                                        <Table
                                                            size="sm"
                                                            className="mb-0 align-middle"
                                                        >
                                                            <thead className="table-light text-muted text-uppercase small">
                                                                <tr>
                                                                    <th>
                                                                        User
                                                                    </th>
                                                                    <th>
                                                                        Status
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {role.users
                                                                    .length ===
                                                                0 ? (
                                                                    <tr>
                                                                        <td
                                                                            colSpan={
                                                                                2
                                                                            }
                                                                            className="text-muted"
                                                                        >
                                                                            No
                                                                            users
                                                                            assigned
                                                                            to
                                                                            this
                                                                            role
                                                                            yet.
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    role.users.map(
                                                                        (u) => (
                                                                            <tr
                                                                                key={
                                                                                    u.id
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    {!u.deleted_at ? (
                                                                                        <Link
                                                                                            href={route(
                                                                                                "admin.users.show",
                                                                                                u.id,
                                                                                            )}
                                                                                            className="fw-medium text-reset text-decoration-underline"
                                                                                        >
                                                                                            {
                                                                                                u.name
                                                                                            }
                                                                                        </Link>
                                                                                    ) : (
                                                                                        <div className="fw-medium">
                                                                                            {
                                                                                                u.name
                                                                                            }
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="small text-muted">
                                                                                        {
                                                                                            u.email
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    {u.deleted_at ? (
                                                                                        <span className="badge bg-danger-subtle text-danger">
                                                                                            Archived
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="badge bg-success-subtle text-success">
                                                                                            Active
                                                                                        </span>
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        ),
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Card.Body>
                                            </Card>
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

RolesShow.layout = (page: any) => <Layout children={page} />;
export default RolesShow;
