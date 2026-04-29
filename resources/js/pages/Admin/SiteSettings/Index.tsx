import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { Head, useForm } from "@inertiajs/react";
import Layout from "../../../Layouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { AvatarFilePond } from "../../../Components/Common/AvatarFilePond";
import { submitInertiaMultipartPut } from "../../../utils/inertiaMultipartPut";

type Settings = {
  site_title: string;
  contact_person: string;
  logo_url: string | null;
  favicon_url: string | null;
  footer_copyright: string;
  footer_credit: string;
  timezone: string;
  social_facebook: string;
  social_twitter: string;
  social_linkedin: string;
  social_instagram: string;
  social_youtube: string;
  social_github: string;
};

function SiteSettingsIndex(props: {
  settings: Settings;
  timezones: string[];
}) {
  const { settings, timezones } = props;
  const [logoPondKey, setLogoPondKey] = useState(0);
  const [faviconPondKey, setFaviconPondKey] = useState(0);

  const form = useForm({
    site_title: settings.site_title,
    contact_person: settings.contact_person,
    footer_copyright: settings.footer_copyright,
    footer_credit: settings.footer_credit,
    timezone: settings.timezone,
    social_facebook: settings.social_facebook,
    social_twitter: settings.social_twitter,
    social_linkedin: settings.social_linkedin,
    social_instagram: settings.social_instagram,
    social_youtube: settings.social_youtube,
    social_github: settings.social_github,
    logo: null as File | null,
    favicon: null as File | null,
    remove_logo: false,
    remove_favicon: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInertiaMultipartPut(form, route("admin.site-settings.update"), {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  const logoPreview =
    form.data.remove_logo ? null : (settings.logo_url ?? null);
  const faviconPreview =
    form.data.remove_favicon ? null : (settings.favicon_url ?? null);

  return (
    <React.Fragment>
      <Head title="Site settings | Admin" />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Site settings" pageTitle="Administration" />
          <Row>
            <Col xl={10} lg={11}>
              <Form onSubmit={submit}>
              <Card className="mb-4">
                <Card.Header className="border-0">
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="card-title mb-0">General &amp; branding</h5>
                      <p className="text-muted mb-0 small">
                        Site title, contact, logo, and favicon.
                      </p>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Form.Label htmlFor="site-title" className="form-label">
                            Site title<span className="text-danger"> *</span>
                          </Form.Label>
                          <Form.Control
                            id="site-title"
                            type="text"
                            className="form-control"
                            placeholder="Application name"
                            value={form.data.site_title}
                            onChange={(e) =>
                              form.setData("site_title", e.target.value)
                            }
                            required
                          />
                          {form.errors.site_title && (
                            <div className="text-danger small mt-1">
                              {form.errors.site_title}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Form.Label
                            htmlFor="contact-person"
                            className="form-label"
                          >
                            Contact person
                          </Form.Label>
                          <Form.Control
                            id="contact-person"
                            type="text"
                            className="form-control"
                            placeholder="Name or team"
                            value={form.data.contact_person}
                            onChange={(e) =>
                              form.setData("contact_person", e.target.value)
                            }
                          />
                          {form.errors.contact_person && (
                            <div className="text-danger small mt-1">
                              {form.errors.contact_person}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <hr className="my-4 text-muted" />

                    <Row className="g-4">
                      <Col md={6}>
                        <AvatarFilePond
                          key={logoPondKey}
                          id="site-logo-filepond"
                          variant="site-logo"
                          label="Logo"
                          currentImageUrl={logoPreview}
                          onChange={(file) => {
                            form.setData("logo", file);
                            if (file) form.setData("remove_logo", false);
                          }}
                          error={form.errors.logo}
                        />
                        {logoPreview && (
                          <Form.Check
                            id="remove-logo"
                            className="mt-2"
                            type="checkbox"
                            label="Remove current logo"
                            checked={form.data.remove_logo}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              form.setData("remove_logo", checked);
                              if (checked) {
                                form.setData("logo", null);
                                setLogoPondKey((k) => k + 1);
                              }
                            }}
                          />
                        )}
                      </Col>
                      <Col md={6}>
                        <AvatarFilePond
                          key={faviconPondKey}
                          id="site-favicon-filepond"
                          variant="site-favicon"
                          label="Favicon"
                          currentImageUrl={faviconPreview}
                          onChange={(file) => {
                            form.setData("favicon", file);
                            if (file) form.setData("remove_favicon", false);
                          }}
                          error={form.errors.favicon}
                        />
                        {faviconPreview && (
                          <Form.Check
                            id="remove-favicon"
                            className="mt-2"
                            type="checkbox"
                            label="Remove current favicon"
                            checked={form.data.remove_favicon}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              form.setData("remove_favicon", checked);
                              if (checked) {
                                form.setData("favicon", null);
                                setFaviconPondKey((k) => k + 1);
                              }
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header className="border-0">
                  <h5 className="card-title mb-0">Footer, social &amp; timezone</h5>
                  <p className="text-muted mb-0 small">
                    Copyright line (optional <code className="small">{"{year}"}</code> placeholder),
                    right-side credit, profile URLs, and app timezone.
                  </p>
                </Card.Header>
                <Card.Body>
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Form.Label
                            htmlFor="site-timezone"
                            className="form-label"
                          >
                            Timezone<span className="text-danger"> *</span>
                          </Form.Label>
                          <Form.Select
                            id="site-timezone"
                            value={form.data.timezone}
                            onChange={(e) =>
                              form.setData("timezone", e.target.value)
                            }
                            className="mb-0"
                            style={{ maxHeight: 220 }}
                            required
                          >
                            {timezones.map((tz) => (
                              <option key={tz} value={tz}>
                                {tz}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            Applied on every request (dates, queues using app timezone).
                          </Form.Text>
                          {form.errors.timezone && (
                            <div className="text-danger small mt-1">
                              {form.errors.timezone}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Form.Label
                            htmlFor="footer-credit"
                            className="form-label"
                          >
                            Footer credit (right column)
                          </Form.Label>
                          <Form.Control
                            id="footer-credit"
                            type="text"
                            placeholder="Design & Develop by Themesbrand"
                            value={form.data.footer_credit}
                            onChange={(e) =>
                              form.setData("footer_credit", e.target.value)
                            }
                          />
                          {form.errors.footer_credit && (
                            <div className="text-danger small mt-1">
                              {form.errors.footer_credit}
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Form.Label
                            htmlFor="footer-copyright"
                            className="form-label"
                          >
                            Footer copyright (left column)
                          </Form.Label>
                          <Form.Control
                            id="footer-copyright"
                            as="textarea"
                            rows={2}
                            placeholder={`Leave empty for default: ${new Date().getFullYear()} © Site name. Use {year} for the current year.`}
                            value={form.data.footer_copyright}
                            onChange={(e) =>
                              form.setData("footer_copyright", e.target.value)
                            }
                          />
                          {form.errors.footer_copyright && (
                            <div className="text-danger small mt-1">
                              {form.errors.footer_copyright}
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <hr className="text-muted" />

                    <h6 className="text-muted text-uppercase fs-12 mb-3">
                      Social links
                    </h6>
                    <p className="text-muted small mb-3">
                      Full URLs (https://…). Icons appear in the footer when set.
                    </p>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label className="form-label small">Facebook</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://facebook.com/…"
                          value={form.data.social_facebook}
                          onChange={(e) =>
                            form.setData("social_facebook", e.target.value)
                          }
                        />
                        {form.errors.social_facebook && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_facebook}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Label className="form-label small">X (Twitter)</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://x.com/…"
                          value={form.data.social_twitter}
                          onChange={(e) =>
                            form.setData("social_twitter", e.target.value)
                          }
                        />
                        {form.errors.social_twitter && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_twitter}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Label className="form-label small">LinkedIn</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://linkedin.com/…"
                          value={form.data.social_linkedin}
                          onChange={(e) =>
                            form.setData("social_linkedin", e.target.value)
                          }
                        />
                        {form.errors.social_linkedin && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_linkedin}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Label className="form-label small">Instagram</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://instagram.com/…"
                          value={form.data.social_instagram}
                          onChange={(e) =>
                            form.setData("social_instagram", e.target.value)
                          }
                        />
                        {form.errors.social_instagram && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_instagram}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Label className="form-label small">YouTube</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://youtube.com/…"
                          value={form.data.social_youtube}
                          onChange={(e) =>
                            form.setData("social_youtube", e.target.value)
                          }
                        />
                        {form.errors.social_youtube && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_youtube}
                          </div>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Label className="form-label small">GitHub</Form.Label>
                        <Form.Control
                          type="url"
                          placeholder="https://github.com/…"
                          value={form.data.social_github}
                          onChange={(e) =>
                            form.setData("social_github", e.target.value)
                          }
                        />
                        {form.errors.social_github && (
                          <div className="text-danger small mt-1">
                            {form.errors.social_github}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <div className="text-end mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={form.processing}
                      >
                        <i className="ri-save-3-line align-bottom me-1"></i>
                        Save all settings
                      </Button>
                    </div>
                </Card.Body>
              </Card>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

SiteSettingsIndex.layout = (page: any) => <Layout children={page} />;

export default SiteSettingsIndex;
