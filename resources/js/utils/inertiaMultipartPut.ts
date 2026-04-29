/**
 * PHP/Laravel typically do not populate `$_POST` / Request input from
 * `multipart/form-data` bodies on **HTTP PUT** the same way as POST.
 * Use **POST + `_method: put`** (Laravel method spoofing) when uploading files on update.
 *
 * Resets the form transform on finish so later submits are unaffected.
 */
export function submitInertiaMultipartPut(
    form: {
        transform: (
            fn: (data: Record<string, unknown>) => Record<string, unknown>,
        ) => void;
        post: (url: string, options?: Record<string, unknown>) => void;
    },
    url: string,
    options: Record<string, unknown> = {},
): void {
    const { onFinish: userOnFinish, ...rest } = options;

    form.transform((data) => ({ ...data, _method: "put" }));
    form.post(url, {
        ...rest,
        onFinish: () => {
            form.transform((data) => ({ ...data }));
            if (typeof userOnFinish === "function") {
                userOnFinish();
            }
        },
    });
}
