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
import AdminRoleSelect from "../../../Components/Common/AdminRoleSelect";
import { AvatarFilePond } from "../../../Components/Common/AvatarFilePond";
import {
  AdminExportCsvModal,
  AdminListToolbar,
  AdminLoadingOverlay,
  AdminPaginationFooter,
  AdminTableEmptyState,
  useInertiaListLoading,
} from "../../../Components/Common/AdminServerListChrome";
import { submitInertiaMultipartPut } from "../../../utils/inertiaMultipartPut";

type RoleOpt = { id: number; name: string; slug: string };

type UserRow = {
  id: number;
  name: string;
  email: string;
  role_id: number | null;
  avatar: string | null;
  avatar_url: string;
  phone: string | null;
  deleted_at: string | null;
  role: RoleOpt | null;
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

function UsersIndex(props: {
  users: Paginated<UserRow>;
  roles: RoleOpt[];
  filters: { trashed: boolean; search?: string };
}) {
  const { users, roles, filters } = props;
  const listLoading = useInertiaListLoading();
  const [exportOpen, setExportOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);
  const [avatarPondKey, setAvatarPondKey] = useState(0);

  const form = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "" as string | number | "",
    avatar: null as File | null,
  });

  const closeModal = useCallback(() => {
    setModal(false);
    setEditingUser(null);
    setIsEdit(false);
    form.reset();
    form.clearErrors();
  }, [form]);

  const openCreate = () => {
    setAvatarPondKey((k) => k + 1);
    setEditingUser(null);
    setIsEdit(false);
    form.reset();
    form.clearErrors();
    setModal(true);
  };

  const openEdit = (u: UserRow) => {
    setAvatarPondKey((k) => k + 1);
    setEditingUser(u);
    setIsEdit(true);
    form.clearErrors();
    form.setData({
      name: u.name,
      email: u.email,
      password: "",
      password_confirmation: "",
      role_id: u.role_id ?? "",
      avatar: null,
    });
    setModal(true);
  };

  const submitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && editingUser) {
      submitInertiaMultipartPut(form, route("admin.users.update", editingUser.id), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      form.post(route("admin.users.store"), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!deletingUser) return;
    router.delete(route("admin.users.destroy", deletingUser.id), {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModal(false);
        setDeletingUser(null);
      },
    });
  };

  const trashedToggleHref = filters.trashed
    ? route("admin.users.index", { search: filters.search || undefined })
    : route("admin.users.index", {
        trashed: 1,
        search: filters.search || undefined,
      });

  const csvRows = useMemo(
    () =>
      users.data.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role?.name ?? "",
        Phone: u.phone ?? "",
      })),
    [users.data]
  );

  return (
    <React.Fragment>
      <Head title="Users | Admin" />
      <div className="page-content">
        <AdminExportCsvModal
          show={exportOpen}
          onClose={() => setExportOpen(false)}
          data={csvRows}
        />
        <DeleteModal
          show={deleteModal}
          recordId={deletingUser?.email}
          onDeleteClick={confirmDelete}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Users" pageTitle="Administration" />
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header className="border-0">
                  <Row className="align-items-center gy-3">
                    <Col>
                      <h5 className="card-title mb-0">User accounts</h5>
                      <p className="text-muted mb-0 small">
                        Quick create and edit in the modal. Open a profile for the full form.
                      </p>
                    </Col>
                    <Col xs="auto" className="d-flex flex-wrap gap-2">
                      <Link
                        href={trashedToggleHref}
                        className="btn btn-soft-secondary"
                        preserveScroll
                      >
                        {filters.trashed ? "Active users" : "Trash"}
                      </Link>
                      {!filters.trashed && (
                        <Button variant="primary" onClick={openCreate}>
                          <i className="ri-add-line align-bottom me-1"></i>
                          Add user
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="pt-0">
                  <AdminListToolbar
                    routeName="admin.users.index"
                    trashed={filters.trashed}
                    search={filters.search ?? ""}
                    searchPlaceholder="Search name, email, or phone…"
                    onExportClick={() => setExportOpen(true)}
                  />
                  <AdminLoadingOverlay show={listLoading}>
                    {users.data.length === 0 ? (
                      <AdminTableEmptyState
                        title="No users found"
                        description={
                          filters.search
                            ? "Nothing matches your search. Try different keywords or clear the search box."
                            : filters.trashed
                              ? "The trash is empty."
                              : "Add a user to see them listed here."
                        }
                      />
                    ) : (
                      <>
                        <div className="table-responsive table-card mb-0">
                          <Table hover className="align-middle table-nowrap mb-0">
                            <thead className="table-light text-muted text-uppercase small">
                              <tr>
                                <th style={{ width: 56 }}> </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th style={{ width: 140 }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.data.map((u) => (
                                <tr key={u.id}>
                                  <td>
                                    <img
                                      src={u.avatar_url}
                                      alt=""
                                      className="avatar-xs rounded-circle"
                                      height="32"
                                    />
                                  </td>
                                  <td className="fw-medium">{u.name}</td>
                                  <td>{u.email}</td>
                                  <td>
                                    <span className="badge bg-primary-subtle text-primary text-uppercase">
                                      {u.role?.name ?? "—"}
                                    </span>
                                  </td>
                                  <td>
                                    {!filters.trashed ? (
                                      <ul className="list-inline hstack gap-2 mb-0">
                                        <li className="list-inline-item">
                                          <Link
                                            href={route("admin.users.show", u.id)}
                                            className="text-primary"
                                          >
                                            <i className="ri-file-list-3-line fs-16"></i>
                                          </Link>
                                        </li>
                                        <li className="list-inline-item">
                                          <Button
                                            variant="link"
                                            className="text-primary p-0"
                                            onClick={() => openEdit(u)}
                                          >
                                            <i className="ri-pencil-fill fs-16"></i>
                                          </Button>
                                        </li>
                                        <li className="list-inline-item">
                                          <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => {
                                              setDeletingUser(u);
                                              setDeleteModal(true);
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
                                            route("admin.users.restore", u.id),
                                            {},
                                            { preserveScroll: true }
                                          )
                                        }
                                      >
                                        Restore
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                        <AdminPaginationFooter
                          links={users.links}
                          from={users.from}
                          to={users.to}
                          total={users.total}
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
          show={modal}
          onHide={closeModal}
          title={isEdit ? "Edit user" : "Add user"}
          banner={null}
          validationErrors={form.errors}
        >
          <Form onSubmit={submitModal}>
            <div className="mb-3">
              <Form.Label htmlFor="admin-user-name" className="form-label">
                Name<span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control
                id="admin-user-name"
                type="text"
                placeholder="Name"
                value={form.data.name}
                onChange={(e) => form.setData("name", e.target.value)}
                required
                isInvalid={!!form.errors.name}
              />
              {form.errors.name && (
                <div className="text-danger small mt-1">{form.errors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="admin-user-email" className="form-label">
                Email<span className="text-danger"> *</span>
              </Form.Label>
              <Form.Control
                id="admin-user-email"
                type="email"
                placeholder="Email"
                value={form.data.email}
                onChange={(e) => form.setData("email", e.target.value)}
                required
                isInvalid={!!form.errors.email}
              />
              {form.errors.email && (
                <div className="text-danger small mt-1">{form.errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="admin-user-role" className="form-label">
                Role
              </Form.Label>
              <AdminRoleSelect
                inputId="admin-user-role"
                roles={roles}
                value={form.data.role_id}
                onChange={(roleId) => form.setData("role_id", roleId)}
                error={form.errors.role_id}
                placeholder="Role"
                menuPortal
                invalid={!!form.errors.role_id}
              />
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="admin-user-password" className="form-label">
                {isEdit ? "New password (optional)" : (
                  <>
                    Password<span className="text-danger"> *</span>
                  </>
                )}
              </Form.Label>
              <Form.Control
                id="admin-user-password"
                type="password"
                placeholder={isEdit ? "New password (optional)" : "Password"}
                value={form.data.password}
                onChange={(e) => form.setData("password", e.target.value)}
                required={!isEdit}
                autoComplete="new-password"
                isInvalid={!!form.errors.password}
              />
              {form.errors.password && (
                <div className="text-danger small mt-1">{form.errors.password}</div>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="admin-user-password-confirm" className="form-label">
                Confirm password
                {!isEdit && <span className="text-danger"> *</span>}
              </Form.Label>
              <Form.Control
                id="admin-user-password-confirm"
                type="password"
                placeholder="Confirm password"
                value={form.data.password_confirmation}
                onChange={(e) => form.setData("password_confirmation", e.target.value)}
                required={!isEdit}
                autoComplete="new-password"
                isInvalid={!!form.errors.password_confirmation}
              />
              {form.errors.password_confirmation && (
                <div className="text-danger small mt-1">
                  {form.errors.password_confirmation}
                </div>
              )}
            </div>
            <div className="mb-3">
              <AvatarFilePond
                key={avatarPondKey}
                id="admin-user-avatar"
                label="Avatar"
                currentImageUrl={isEdit && editingUser ? editingUser.avatar_url : undefined}
                onChange={(file) => form.setData("avatar", file)}
                error={form.errors.avatar}
              />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <Button variant="light" type="button" onClick={closeModal}>
                <i className="ri-close-line me-1 align-middle"></i>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={form.processing}>
                <i
                  className={`me-1 align-middle ${isEdit ? "ri-save-3-line" : "ri-user-add-line"}`}
                ></i>
                {isEdit ? "Save changes" : "Add user"}
              </Button>
            </div>
          </Form>
        </VelzonThemeFormModal>
      </div>
    </React.Fragment>
  );
}

UsersIndex.layout = (page: any) => <Layout children={page} />;
export default UsersIndex;
