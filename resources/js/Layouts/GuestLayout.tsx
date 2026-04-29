import React from "react";
import { Col, Row } from "react-bootstrap";
import { FlashVelzonToasts } from "../Components/Common/VelzonToast";
export default function Guest({ children }: any) {
    return (
        <React.Fragment>
            <div className="auth-page-wrapper">
                <div className="auth-one-bg-position"></div>

                {children}
                <FlashVelzonToasts />

                <footer className="footer">
                    <div className="container">
                        <Row>
                            <Col lg={12}>
                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        &copy; {new Date().getFullYear()}{" "}
                                        Velzon. Crafted with{" "}
                                        <i className="mdi mdi-heart text-danger"></i>{" "}
                                        by Themesbrand
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
}
