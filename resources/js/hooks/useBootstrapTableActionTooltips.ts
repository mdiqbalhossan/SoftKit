import { useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    disposeTableActionTooltipsIn,
    initTableActionTooltips,
} from "../utils/tableActionTooltips";

function mainContentRoot(): ParentNode {
    return document.querySelector(".main-content") ?? document.body;
}

function scheduleInit(): void {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initTableActionTooltips(mainContentRoot());
        });
    });
}

/**
 * Hooks Bootstrap 5 tooltips onto table row action controls app-wide (icon links/buttons,
 * compact restore buttons). Re-runs after each Inertia navigation. Dispose runs before each visit.
 */
export function useBootstrapTableActionTooltips(): void {
    useEffect(() => {
        const offStart = router.on("start", () => {
            disposeTableActionTooltipsIn(mainContentRoot());
        });

        scheduleInit();

        const offFinish = router.on("finish", () => {
            scheduleInit();
        });

        return () => {
            offStart();
            offFinish();
            disposeTableActionTooltipsIn(mainContentRoot());
        };
    }, []);
}
