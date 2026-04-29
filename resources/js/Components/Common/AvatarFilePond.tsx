import React from "react";
import { Form } from "react-bootstrap";
import { FilePond, registerPlugin } from "react-filepond";
import { FileOrigin, type FilePondFile } from "filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export type AvatarFilePondVariant = "avatar" | "site-logo" | "site-favicon";

export type AvatarFilePondProps = {
  id?: string;
  label: React.ReactNode;
  onChange: (file: File | null) => void;
  error?: string;
  /** Shown above the drop zone; existing server image is not posted until a new file is chosen. */
  currentImageUrl?: string | null;
  className?: string;
  /**
   * Presets for user avatars vs site branding (controls hints, accepted types, preview shape).
   * @default "avatar"
   */
  variant?: AvatarFilePondVariant;
};

/**
 * Single image picker using Velzon’s FilePond styling (see Forms → File Upload).
 * Files are held locally for Inertia `forceFormData` submit (no FilePond server upload).
 */
const AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
] as const;

export function AvatarFilePond({
  id = "user-avatar-filepond",
  label,
  onChange,
  error,
  currentImageUrl,
  className = "filepond filepond-input-multiple mb-0",
  variant = "avatar",
}: AvatarFilePondProps) {
  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const first = fileItems[0];
    if (!first) {
      onChange(null);
      return;
    }
    if (first.origin === FileOrigin.INPUT) {
      onChange(first.file as File);
    }
  };

  const acceptedFileTypes = [...AVATAR_TYPES];

  const pondName =
    variant === "site-favicon"
      ? "favicon"
      : variant === "site-logo"
        ? "logo"
        : "avatar";

  const helperText =
    variant === "site-favicon" ? (
      <>
        FilePond: PNG, SVG, ICO, or WebP. Browsers vary on ICO detection — invalid types are
        rejected when you save. Max 1&nbsp;MB.
      </>
    ) : variant === "site-logo" ? (
      <>
        FilePond optimizes images for upload. Used in sidebar and header — wide or square PNG
        works well. Max 4&nbsp;MB (PNG, JPG, GIF, WebP).
      </>
    ) : (
      <>
        FilePond optimizes images for upload. Use a square image for best results. Max 2&nbsp;MB
        (PNG, JPG, GIF, WebP).
      </>
    );

  const currentCaption =
    variant === "site-favicon"
      ? "Current favicon — drop a new file below to replace."
      : variant === "site-logo"
        ? "Current logo — drop a new image below to replace."
        : "Current avatar — drop a new image below to replace.";

  const currentPreview =
    currentImageUrl ? (
      <div className="d-flex align-items-center gap-2 mb-2">
        {variant === "avatar" ? (
          <img
            src={currentImageUrl}
            alt=""
            className="rounded-circle border"
            height={56}
            width={56}
            style={{ objectFit: "cover" }}
          />
        ) : variant === "site-logo" ? (
          <img
            src={currentImageUrl}
            alt=""
            className="rounded border bg-light p-1"
            height={40}
            style={{ objectFit: "contain", maxWidth: 200 }}
          />
        ) : (
          <img
            src={currentImageUrl}
            alt=""
            className="rounded border bg-light p-1"
            width={32}
            height={32}
            style={{ objectFit: "contain" }}
          />
        )}
        <span className="text-muted small">{currentCaption}</span>
      </div>
    ) : null;

  return (
    <div className="mb-0">
      <Form.Label htmlFor={id} className="form-label">
        {label}
      </Form.Label>
      {currentPreview}
      <p className="text-muted small mb-2">{helperText}</p>
      <FilePond
        id={id}
        allowMultiple={false}
        maxFiles={1}
        instantUpload={false}
        allowFileTypeValidation={variant !== "site-favicon"}
        acceptedFileTypes={variant === "site-favicon" ? undefined : acceptedFileTypes}
        name={pondName}
        className={className}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        onupdatefiles={handleUpdateFiles}
        credits={false}
      />
      {error ? <div className="text-danger small mt-1">{error}</div> : null}
    </div>
  );
}

export default AvatarFilePond;
