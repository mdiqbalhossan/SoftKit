import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { usePage } from "@inertiajs/react";

type SiteFooter = {
    title?: string;
    contact_person?: string;
    footer_copyright?: string;
    footer_credit?: string;
    social?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
        github?: string;
    };
};

const SOCIAL_META: {
    key: keyof NonNullable<SiteFooter["social"]>;
    icon: string;
    label: string;
}[] = [
    { key: "facebook", icon: "ri-facebook-fill", label: "Facebook" },
    { key: "twitter", icon: "ri-twitter-x-fill", label: "X (Twitter)" },
    { key: "linkedin", icon: "ri-linkedin-fill", label: "LinkedIn" },
    { key: "instagram", icon: "ri-instagram-fill", label: "Instagram" },
    { key: "youtube", icon: "ri-youtube-fill", label: "YouTube" },
    { key: "github", icon: "ri-github-fill", label: "GitHub" },
];

const Footer = () => {
    const { site } = usePage().props as { site?: SiteFooter };
    const year = new Date().getFullYear();
    const brand = site?.title || "Velzon";

    const copyrightTemplate = site?.footer_copyright?.trim() ?? "";
    const primaryLine = copyrightTemplate
        ? copyrightTemplate.split("{year}").join(String(year))
        : `${year} © ${brand}.`;

    const creditLine =
        site?.footer_credit?.trim() || "Design & Develop by Themesbrand";

    const social = site?.social ?? {};
    const socialNodes = SOCIAL_META.filter((s) => {
        const u = social[s.key];
        return typeof u === "string" && u.length > 0;
    });

    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row className="align-items-center gy-2">
                        <Col md={true}>
                            <span className="d-block d-md-inline">
                                {primaryLine}
                            </span>
                            {site?.contact_person ? (
                                <span className="text-muted d-block d-md-inline ms-md-2">
                                    · Contact: {site.contact_person}
                                </span>
                            ) : null}
                        </Col>
                        {socialNodes.length > 0 ? (
                            <Col xs="auto" className="text-md-center">
                                <div className="d-flex flex-wrap align-items-center gap-2 justify-content-md-center">
                                    {socialNodes.map((s) => (
                                        <a
                                            key={s.key}
                                            href={social[s.key]!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted fs-16"
                                            title={s.label}
                                            aria-label={s.label}
                                        >
                                            <i className={s.icon}></i>
                                        </a>
                                    ))}
                                </div>
                            </Col>
                        ) : null}
                        <Col md="auto" className="text-md-end">
                            <div className="text-muted small">{creditLine}</div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
