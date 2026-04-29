import React, { useEffect } from "react";
import GuestLayout from "../../Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import logoLight from "../../../images/logo-light.png";
import { useVelzonToastFromValidationErrors } from "../../Components/Common/VelzonToast";

export default function ResetPassword({ token, email }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useVelzonToastFromValidationErrors(errors);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e: any) => {
        e.preventDefault();
        post(route("password.store"));
    };

    return (
        <React.Fragment>
            <GuestLayout>
                <Head title="Reset Password | Velzon - React Admin & Dashboard Template" />
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link
                                            href="/#"
                                            className="d-inline-block auth-logo"
                                        >
                                            <img
                                                src={logoLight}
                                                alt=""
                                                height="20"
                                            />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-semibold">
                                        Premium Admin & Dashboard Template
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <Card.Body className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">
                                                Reset password
                                            </h5>
                                            <p className="text-muted">
                                                Choose a new password for your
                                                account
                                            </p>
                                            <i className="ri-lock-password-line display-5 text-success"></i>
                                        </div>

                                        <div className="p-2 mt-4">
                                            <form onSubmit={submit}>
                                                <div>
                                                    <Form.Label
                                                        htmlFor="email"
                                                        className="form-label"
                                                    >
                                                        Email
                                                    </Form.Label>
                                                    <span className="text-danger ms-1">
                                                        *
                                                    </span>
                                                    <Form.Control
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        placeholder="Enter Email"
                                                        value={data.email}
                                                        className={
                                                            "mt-1 form-control " +
                                                            (errors.email
                                                                ? "is-invalid"
                                                                : "")
                                                        }
                                                        autoComplete="username"
                                                        onChange={(e: any) =>
                                                            setData(
                                                                "email",
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <Form.Control.Feedback
                                                        type="invalid"
                                                        className="mt-2 d-block"
                                                    >
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </div>

                                                <div className="mt-4">
                                                    <Form.Label
                                                        htmlFor="password"
                                                        className="form-label"
                                                    >
                                                        Password
                                                    </Form.Label>
                                                    <span className="text-danger ms-1">
                                                        *
                                                    </span>
                                                    <Form.Control
                                                        id="password"
                                                        type="password"
                                                        name="password"
                                                        placeholder="Enter Password"
                                                        value={data.password}
                                                        className={
                                                            "mt-1 form-control " +
                                                            (errors.password
                                                                ? "is-invalid"
                                                                : "")
                                                        }
                                                        autoComplete="new-password"
                                                        onChange={(e: any) =>
                                                            setData(
                                                                "password",
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <Form.Control.Feedback
                                                        type="invalid"
                                                        className="mt-2 d-block"
                                                    >
                                                        {errors.password}
                                                    </Form.Control.Feedback>
                                                </div>

                                                <div className="mt-4">
                                                    <Form.Label
                                                        htmlFor="password_confirmation"
                                                        className="form-label"
                                                    >
                                                        Confirm password
                                                    </Form.Label>
                                                    <span className="text-danger ms-1">
                                                        *
                                                    </span>
                                                    <Form.Control
                                                        id="password_confirmation"
                                                        type="password"
                                                        name="password_confirmation"
                                                        placeholder="Confirm password"
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        className={
                                                            "mt-1 form-control " +
                                                            (errors.password_confirmation
                                                                ? "is-invalid"
                                                                : "")
                                                        }
                                                        autoComplete="new-password"
                                                        onChange={(e: any) =>
                                                            setData(
                                                                "password_confirmation",
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <Form.Control.Feedback
                                                        type="invalid"
                                                        className="mt-2 d-block"
                                                    >
                                                        {
                                                            errors.password_confirmation
                                                        }
                                                    </Form.Control.Feedback>
                                                </div>

                                                <div className="d-flex flex-column gap-2 mt-4">
                                                    <Button
                                                        type="submit"
                                                        className="btn btn-success w-100"
                                                        disabled={processing}
                                                    >
                                                        <i className="ri-lock-unlock-line align-middle me-1"></i>
                                                        Reset password
                                                    </Button>
                                                    <Link
                                                        href={route("login")}
                                                        className="btn btn-light w-100 text-center"
                                                    >
                                                        <i className="ri-close-line align-middle me-1"></i>
                                                        Cancel
                                                    </Link>
                                                </div>
                                            </form>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">
                                        Back to{" "}
                                        <Link
                                            href={route("login")}
                                            className="fw-bold text-primary text-decoration-underline"
                                        >
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
}
