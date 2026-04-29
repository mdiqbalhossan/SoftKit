import React, { useEffect, useState } from "react";
import GuestLayout from "../../Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
    useVelzonToastFromStatus,
    useVelzonToastFromValidationErrors,
} from "../../Components/Common/VelzonToast";

export default function Login({ status, canResetPassword }: any) {
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "admin@themesbrand.com" || "",
        password: "12345678" || "",
        remember: false,
    });

    useVelzonToastFromStatus(status, "generic");
    useVelzonToastFromValidationErrors(errors);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e: any) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <React.Fragment>
            <GuestLayout>
                <Head title="Login Page" />
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <Card.Body className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">
                                                Welcome Back !
                                            </h5>
                                            <p className="text-muted">
                                                Sign in to continue to Velzon.
                                            </p>
                                        </div>
                                        {status && (
                                            <div className="mb-4 font-medium text-sm text-green-600">
                                                {status}
                                            </div>
                                        )}
                                        <div className="p-2 mt-4">
                                            <Form onSubmit={submit}>
                                                <div className="mb-3">
                                                    <Form.Label
                                                        className="form-label"
                                                        htmlFor="email"
                                                        value="Email"
                                                    >
                                                        {" "}
                                                        Email{" "}
                                                    </Form.Label>
                                                    <span className="text-danger ms-1">
                                                        *
                                                    </span>
                                                    <Form.Control
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter email"
                                                        value={data.email}
                                                        className={
                                                            "mb-1 " +
                                                            (errors.email
                                                                ? "is-invalid"
                                                                : " ")
                                                        }
                                                        autoComplete="username"
                                                        autoFocus
                                                        required
                                                        onChange={(e: any) =>
                                                            setData(
                                                                "email",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />

                                                    <Form.Control.Feedback
                                                        type="invalid"
                                                        className="d-block mt-2"
                                                    >
                                                        {" "}
                                                        {errors.email}{" "}
                                                    </Form.Control.Feedback>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="float-end">
                                                        {canResetPassword && (
                                                            <Link
                                                                href={route(
                                                                    "password.request",
                                                                )}
                                                                className="text-muted"
                                                            >
                                                                Forgot password?
                                                            </Link>
                                                        )}
                                                    </div>

                                                    <Form.Label
                                                        className="form-label"
                                                        htmlFor="password"
                                                        value="Password"
                                                    >
                                                        {" "}
                                                        Password{" "}
                                                    </Form.Label>
                                                    <span className="text-danger ms-1">
                                                        *
                                                    </span>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Form.Control
                                                            id="password"
                                                            type={
                                                                passwordShow
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="password"
                                                            value={
                                                                data.password
                                                            }
                                                            placeholder="Enter Password"
                                                            required
                                                            className={
                                                                "mt-1 " +
                                                                (errors.password
                                                                    ? "is-invalid"
                                                                    : " ")
                                                            }
                                                            autoComplete="current-password"
                                                            onChange={(
                                                                e: any,
                                                            ) =>
                                                                setData(
                                                                    "password",
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />

                                                        <Form.Control.Feedback
                                                            type="invalid"
                                                            className="d-block mt-2"
                                                        >
                                                            {" "}
                                                            {
                                                                errors.password
                                                            }{" "}
                                                        </Form.Control.Feedback>
                                                        <button
                                                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                            type="button"
                                                            id="password-addon"
                                                            onClick={() =>
                                                                setPasswordShow(
                                                                    !passwordShow,
                                                                )
                                                            }
                                                        >
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="block mt-4">
                                                    <label className="flex items-center">
                                                        <Form.Check.Input
                                                            className="form-check-input"
                                                            name="remember"
                                                            checked={
                                                                data.remember
                                                            }
                                                            onChange={(
                                                                e: any,
                                                            ) =>
                                                                setData(
                                                                    "remember",
                                                                    e.target
                                                                        .checked,
                                                                )
                                                            }
                                                        />
                                                        <Form.Check.Label
                                                            className="form-check-label"
                                                            htmlFor="auth-remember-check"
                                                        >
                                                            <span className="ms-2">
                                                                Remember me
                                                            </span>
                                                        </Form.Check.Label>
                                                    </label>
                                                </div>

                                                <div className="mt-4 d-flex flex-column gap-2">
                                                    <Button
                                                        type="submit"
                                                        className="btn btn-success w-100"
                                                        disabled={processing}
                                                    >
                                                        <i className="ri-login-box-line align-middle me-1"></i>
                                                        Sign In
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
}
