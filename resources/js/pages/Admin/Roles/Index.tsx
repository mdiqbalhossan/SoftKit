import React, { useCallback, useMemo, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Table,
} from "react-bootstrap";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Layout from "../../../Layouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import VelzonThemeFormModal from "../../../Components/Common/VelzonThemeFormModal";
import {
    AdminExportCsvModal,
    AdminListToolbar,
    AdminLoadingOverlay,
    AdminPaginationFooter,
    AdminTableEmptyState,
    useInertiaListLoading,
} from "../../../Components/Common/AdminServerListChrome";

type RoleRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    users_count?: number;
    deleted_at: string | null;
};

type Paginated<T> = {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
};

function RolesIndex(props: {
    roles: Paginated<RoleRow>;
    filters: { trashed: boolean; search?: string };
}) {
    const { roles, filters } = props;
    const listLoading = useInertiaListLoading();
    const [exportOpen, setExportOpen] = useState(false);
    const [drawer, setDrawer] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editing, setEditing] = useState<RoleRow | null>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState<RoleRow | null>(null);

    const form = useForm({
        name: "",
        slug: "",
        description: "",
    });

    const closeDrawer = useCallback(() => {
        setDrawer(false);
        setEditing(null);
        setIsEdit(false);
        form.reset();
        form.clearErrors();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setIsEdit(false);
        form.reset();
        form.clearErrors();
        setDrawer(true);
    };

    const openEdit = (r: RoleRow) => {
        setEditing(r);
        setIsEdit(true);
        form.clearErrors();
        form.setData({
            name: r.name,
            slug: r.slug,
            description: r.description ?? "",
        });
        setDrawer(true);
    };

    const submitDrawer = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && editing) {
            form.put(route("admin.roles.update", editing.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDrawer();
                },
            });
        } else {
            form.post(route("admin.roles.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDrawer();
                },
            });
        }
    };

    const confirmDelete = () => {
        if (!deleting) return;
        router.delete(route("admin.roles.destroy", deleting.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModal(false);
                setDeleting(null);
            },
        });
    };

    const trashedHref = filters.trashed
        ? route("admin.roles.index", { search: filters.search || undefined })
        : route("admin.roles.index", {
              trashed: 1,
              search: filters.search || undefined,
          });

    const csvRows = useMemo(
        () =>
            roles.data.map((r) => ({
                Name: r.name,
                Slug: r.slug,
                Members: String(r.users_count ?? 0),
                Description: r.description ?? "",
            })),
        [roles.data],
    );

    return (
        <React.Fragment>
            <Head title="Roles | Admin" />
            <div className="page-content">
                <AdminExportCsvModal
                    show={exportOpen}
                    onClose={() => setExportOpen(false)}
                    data={csvRows}
                />
                <DeleteModal
                    show={deleteModal}
                    recordId={deleting?.name}
                    onDeleteClick={confirmDelete}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Container fluid>
                    <BreadCrumb title="Roles" pageTitle="Administration" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <Card.Header className="border-0">
                                    <Row className="align-items-center gy-3">
                                        <Col>
                                            <h5 className="card-title mb-0">
                                                Access roles
                                            </h5>
                                            <p className="text-muted mb-0 small">
                                                Short edits in the drawer. Open
                                                a role for the long description
                                                and roster.
                                            </p>
                                        </Col>
                                        <Col
                                            xs="auto"
                                            className="d-flex flex-wrap gap-2"
                                        >
                                            <Link
                                                href={trashedHref}
                                                className="btn btn-soft-secondary"
                                                preserveScroll
                                            >
                                                {filters.trashed
                                                    ? "Active roles"
                                                    : "Trash"}
                                            </Link>
                                            {!filters.trashed && (
                                                <Button
                                                    variant="primary"
                                                    onClick={openCreate}
                                                >
                                                    <i className="ri-add-line align-bottom me-1"></i>
                                                    Add role
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body className="pt-0">
                                    <AdminListToolbar
                                        routeName="admin.roles.index"
                                        trashed={filters.trashed}
                                        search={filters.search ?? ""}
                                        searchPlaceholder="Search name, slug, or description…"
                                        onExportClick={() =>
                                            setExportOpen(true)
                                        }
                                    />
                                    <AdminLoadingOverlay show={listLoading}>
                                        {roles.data.length === 0 ? (
                                            <AdminTableEmptyState
                                                title="No roles found"
                                                description={
                                                    filters.search
                                                        ? "Nothing matches your search. Try different keywords or clear the search box."
                                                        : filters.trashed
                                                          ? "The trash is empty."
                                                          : "Add a role to see it listed here."
                                                }
                                            />
                                        ) : (
                                            <>
                                                <div className="table-responsive table-card mb-0">
                                                    <Table
                                                        hover
                                                        className="align-middle table-nowrap mb-0"
                                                    >
                                                        <thead className="table-light text-muted text-uppercase small">
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Slug</th>
                                                                <th>Members</th>
                                                                <th
                                                                    style={{
                                                                        width: 140,
                                                                    }}
                                                                >
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {roles.data.map(
                                                                (r) => (
                                                                    <tr
                                                                        key={
                                                                            r.id
                                                                        }
                                                                    >
                                                                        <td className="fw-medium">
                                                                            {
                                                                                r.name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <code className="small">
                                                                                {
                                                                                    r.slug
                                                                                }
                                                                            </code>
                                                                        </td>
                                                                        <td>
                                                                            {r.users_count ??
                                                                                0}
                                                                        </td>
                                                                        <td>
                                                                            {!filters.trashed ? (
                                                                                <ul className="list-inline hstack gap-2 mb-0">
                                                                                    <li className="list-inline-item">
                                                                                        <Link
                                                                                            href={route(
                                                                                                "admin.roles.show",
                                                                                                r.id,
                                                                                            )}
                                                                                            className="text-primary"
                                                                                        >
                                                                                            <i className="ri-file-list-3-line fs-16"></i>
                                                                                        </Link>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        <Button
                                                                                            variant="link"
                                                                                            className="text-primary p-0"
                                                                                            onClick={() =>
                                                                                                openEdit(
                                                                                                    r,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <i className="ri-pencil-fill fs-16"></i>
                                                                                        </Button>
                                                                                    </li>
                                                                                    <li className="list-inline-item">
                                                                                        <Button
                                                                                            variant="link"
                                                                                            className="text-danger p-0"
                                                                                            onClick={() => {
                                                                                                setDeleting(
                                                                                                    r,
                                                                                                );
                                                                                                setDeleteModal(
                                                                                                    true,
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <i className="ri-delete-bin-5-line fs-16"></i>
                                                                                        </Button>
                                                                                    </li>
                                                                                </ul>
                                                                            ) : (
                                                                                <Button
                                                                                    size="sm"
                                                                                    className="btn btn-soft-primary"
                                                                                    onClick={() =>
                                                                                        router.post(
                                                                                            route(
                                                                                                "admin.roles.restore",
                                                                                                r.id,
                                                                                            ),
                                                                                            {},
                                                                                            {
                                                                                                preserveScroll: true,
                                                                                            },
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Restore
                                                                                </Button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <AdminPaginationFooter
                                                    links={roles.links}
                                                    from={roles.from}
                                                    to={roles.to}
                                                    total={roles.total}
                                                />
                                            </>
                                        )}
                                    </AdminLoadingOverlay>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

                <VelzonThemeFormModal
                    show={drawer}
                    onHide={closeDrawer}
                    title={isEdit ? "Edit role" : "Add role"}
                    banner={null}
                    validationErrors={form.errors}
                >
                    <Form onSubmit={submitDrawer}>
                        <div className="mb-3">
                            <Form.Label
                                htmlFor="admin-role-name"
                                className="form-label"
                            >
                                Name<span className="text-danger"> *</span>
                            </Form.Label>
                            <Form.Control
                                id="admin-role-name"
                                type="text"
                                placeholder="Name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                                required
                                isInvalid={!!form.errors.name}
                            />
                            {form.errors.name && (
                                <div className="text-danger small mt-1">
                                    {form.errors.name}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <Form.Label
                                htmlFor="admin-role-slug"
                                className="form-label"
                            >
                                Slug
                            </Form.Label>
                            <Form.Control
                                id="admin-role-slug"
                                type="text"
                                placeholder="Slug"
                                value={form.data.slug}
                                onChange={(e) =>
                                    form.setData("slug", e.target.value)
                                }
                                isInvalid={!!form.errors.slug}
                            />
                            {form.errors.slug && (
                                <div className="text-danger small mt-1">
                                    {form.errors.slug}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <Form.Label
                                htmlFor="admin-role-description"
                                className="form-label"
                            >
                                Short description
                            </Form.Label>
                            <Form.Control
                                id="admin-role-description"
                                as="textarea"
                                rows={4}
                                placeholder="Short description"
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData("description", e.target.value)
                                }
                                isInvalid={!!form.errors.description}
                            />
                            {form.errors.description && (
                                <div className="text-danger small mt-1">
                                    {form.errors.description}
                                </div>
                            )}
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button
                                variant="light"
                                type="button"
                                onClick={closeDrawer}
                            >
                                <i className="ri-close-line me-1 align-middle"></i>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={form.processing}
                            >
                                <i
                                    className={`me-1 align-middle ${isEdit ? "ri-save-3-line" : "ri-add-line"}`}
                                ></i>
                                {isEdit ? "Save changes" : "Add role"}
                            </Button>
                        </div>
                    </Form>
                </VelzonThemeFormModal>
            </div>
        </React.Fragment>
    );
}

RolesIndex.layout = (page: any) => <Layout children={page} />;
export default RolesIndex;
