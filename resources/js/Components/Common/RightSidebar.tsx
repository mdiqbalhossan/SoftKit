import React, { useEffect } from 'react';
import { useSelector } from "react-redux";

import { PERLOADER_TYPES } from "../constants/layout";

const RightSidebar = () => {
    const preloader = useSelector((state: any) => state.Layout.preloader);

    useEffect(() => {
        const handler = () => {
            const element = document.getElementById("back-to-top");
            if (element) {
                if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }
            }
        };
        window.addEventListener("scroll", handler);
        handler();
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const pathName = window.location.pathname;

    useEffect(() => {
        const preloaderEl = document.getElementById("preloader") as HTMLElement;

        if (preloaderEl) {
            preloaderEl.style.opacity = "1";
            preloaderEl.style.visibility = "visible";

            setTimeout(function () {
                preloaderEl.style.opacity = "0";
                preloaderEl.style.visibility = "hidden";
            }, 1000);
        }
    }, [pathName]);

    return (
        <React.Fragment>
            <button
                type="button"
                onClick={() => toTop()}
                className="btn btn-danger btn-icon" id="back-to-top"
            >
                <i className="ri-arrow-up-line"></i>
            </button>

            {preloader === PERLOADER_TYPES.ENABLE && (
                <div id="preloader">
                    <div id="status">
                        <div className="spinner-border text-primary avatar-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default RightSidebar;
