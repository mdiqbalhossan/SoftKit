import React, { useEffect, useState } from "react";

/**
 * Sidebar menu: Dashboard, Users & roles (submenu), Site settings only.
 */
const Navdata = () => {
    const [isUserRoleMenu, setIsUserRoleMenu] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState<string>("");

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            if (!ul) {
                return;
            }
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            [...iconItems].forEach((item) => {
                item.classList.remove("active");
                const id = item.getAttribute("sub-items");
                const getID: any = document.getElementById(id) as HTMLElement;
                if (getID) {
                    getID?.parentElement.classList.remove("show");
                }
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove("twocolumn-panel");
        if (iscurrentState !== "UserRoleMenu") {
            setIsUserRoleMenu(false);
        }
    }, [iscurrentState, isUserRoleMenu]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "bx bxs-dashboard",
            link: "/dashboard",
        },
        {
            id: "admin-users-roles",
            label: "Users & roles",
            icon: "bx bx-group",
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsUserRoleMenu(!isUserRoleMenu);
                setIscurrentState("UserRoleMenu");
                updateIconSidebar(e);
            },
            stateVariables: isUserRoleMenu,
            subItems: [
                {
                    id: "users-admin",
                    label: "Users",
                    link: "/admin/users",
                    parentId: "admin-users-roles",
                },
                {
                    id: "roles-admin",
                    label: "Roles",
                    link: "/admin/roles",
                    parentId: "admin-users-roles",
                },
            ],
        },
        {
            id: "site-settings-admin",
            label: "Site settings",
            icon: "bx bx-cog",
            link: "/admin/site-settings",
        },
    ];

    return <React.Fragment>{menuItems}</React.Fragment>;
};

export default Navdata;
