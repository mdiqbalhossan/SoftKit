import Select, { SingleValue } from "react-select";

export type AdminRoleOption = { id: number; name: string };

type Props = {
  inputId: string;
  roles: AdminRoleOption[];
  value: number | "" | null | undefined;
  onChange: (roleId: number | "") => void;
  error?: string;
  placeholder?: string;
  /** Render dropdown in document.body (needed inside Bootstrap modals). */
  menuPortal?: boolean;
  /** Highlights control like Bootstrap invalid state */
  invalid?: boolean;
};

export default function AdminRoleSelect({
  inputId,
  roles,
  value,
  onChange,
  error,
  placeholder = "Role",
  menuPortal = false,
  invalid = false,
}: Props) {
  const options = roles.map((r) => ({ label: r.name, value: r.id }));
  const selected: SingleValue<{ label: string; value: number }> =
    value === "" || value === null || value === undefined
      ? null
      : options.find((o) => o.value === Number(value)) ?? null;

  const invalidStyles =
    invalid || error
      ? {
          control: (base: Record<string, unknown>) => ({
            ...base,
            borderColor: "var(--bs-danger)",
            boxShadow: "0 0 0 0.2rem rgba(var(--bs-danger-rgb), 0.25)",
          }),
        }
      : undefined;

  return (
    <>
      <Select
        inputId={inputId}
        instanceId={inputId}
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt ? opt.value : "")}
        placeholder={placeholder}
        isClearable
        className="js-example-basic-single mb-0"
        aria-invalid={invalid || !!error}
        menuPortalTarget={
          menuPortal && typeof document !== "undefined" ? document.body : undefined
        }
        styles={{
          ...(menuPortal
            ? { menuPortal: (base) => ({ ...base, zIndex: 1060 }) }
            : {}),
          ...(invalidStyles ?? {}),
        }}
      />
      {error ? <div className="text-danger small mt-1">{error}</div> : null}
    </>
  );
}
