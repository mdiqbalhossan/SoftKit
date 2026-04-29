import Tooltip from "bootstrap/js/dist/tooltip";

const MARK = "data-table-action-tooltip";

/** Interactive controls inside data tables that typically represent row actions */
const ACTION_SELECTOR = [
  "table.table tbody td ul.list-inline .list-inline-item > a",
  "table.table tbody td ul.list-inline .list-inline-item > button",
  "table.table tbody td > button.btn:not(.dropdown-toggle)",
].join(", ");

function inferTooltipText(el: HTMLElement): string | null {
  const explicit = el.getAttribute("data-tooltip");
  if (explicit?.trim()) return explicit.trim();

  const aria = el.getAttribute("aria-label");
  if (aria?.trim()) return aria.trim();

  const title = el.getAttribute("title");
  if (title?.trim()) return title.trim();

  const icon = el.querySelector("i[class]");
  if (icon) {
    const cls = icon.className;

    if (/ri-eye-line|ri-eye\b|ri-file-list|ri-article|ri-profile-line/.test(cls)) {
      return "View details";
    }
    if (/ri-pencil|mdi-pencil/.test(cls)) return "Edit";
    if (/ri-delete|mdi-delete/.test(cls)) return "Delete";
    if (/ri-add-line|ri-add\b/.test(cls)) return "Add";
    if (/ri-download|mdi-download/.test(cls)) return "Download";
    if (/ri-share|mdi-share/.test(cls)) return "Share";
    if (/ri-more-2-fill|ri-more-fill/.test(cls)) return "More";
  }

  const text = el.textContent?.trim();
  if (text && text.length > 0 && text.length <= 48 && el.tagName === "BUTTON") {
    return text;
  }

  return null;
}

export function disposeTableActionTooltipsIn(container: ParentNode): void {
  container.querySelectorAll<HTMLElement>(`[${MARK}="1"]`).forEach((el) => {
    Tooltip.getInstance(el)?.dispose();
    el.removeAttribute(MARK);
    el.removeAttribute("data-bs-toggle");
    el.removeAttribute("data-bs-placement");
    el.removeAttribute("data-bs-trigger");
  });
}

/**
 * Finds row action links/buttons in Bootstrap tables and attaches Bootstrap 5 tooltips.
 * Skips elements inside [data-table-action-tooltip-ignore].
 * If an element already has data-bs-toggle="tooltip" (without our mark), ensures Tooltip is initialized.
 */
export function initTableActionTooltips(container: ParentNode = document.body): void {
  disposeTableActionTooltipsIn(container);

  container.querySelectorAll<HTMLElement>(ACTION_SELECTOR).forEach((el) => {
    if (el.closest("[data-table-action-tooltip-ignore]")) return;

    const manual =
      el.getAttribute("data-bs-toggle") === "tooltip" &&
      !el.hasAttribute(MARK);
    if (manual) {
      Tooltip.getOrCreateInstance(el);
      return;
    }

    const text = inferTooltipText(el);
    if (!text) return;

    el.setAttribute(MARK, "1");
    el.setAttribute("data-bs-toggle", "tooltip");
    el.setAttribute("data-bs-placement", "top");
    el.setAttribute("data-bs-trigger", "hover");
    el.setAttribute("title", text);

    new Tooltip(el);
  });
}
