import Swal from "sweetalert2";

/**
 * SweetAlert2 delete confirmation. Use for new flows that don't wire through {@link DeleteModal}.
 */
export async function confirmDeleteSwal(recordLabel?: string): Promise<boolean> {
  const label = recordLabel?.trim();
  const result = await Swal.fire({
    title: "Are you sure?",
    text: label
      ? `Are you sure you want to remove this record (${label})?`
      : "Are you sure you want to remove this record?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#F54927",
    cancelButtonColor: "#878a99",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
}
