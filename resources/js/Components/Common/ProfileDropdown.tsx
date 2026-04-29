import React, { useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, usePage } from '@inertiajs/react';
//import images
import avatar1 from "../../../images/users/avatar-1.jpg";

const ProfileDropdown = () => {
    const user = usePage().props.auth.user as {
        name: string;
        avatar_url?: string;
        role?: { name: string } | null;
    } | null;

    const avatarSrc = user?.avatar_url ?? avatar1;
    const subtitle = user?.role?.name ?? "";

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState<boolean>(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown
                show={isProfileDropdown}
                onClick={toggleProfileDropdown}
                className="ms-sm-3 header-item topbar-user">
                <Dropdown.Toggle as="button" type="button" className="arrow-none btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatarSrc}
                            alt="" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user?.name}</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{subtitle}</span>
                        </span>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item
                        as={Link}
                        href={route("profile.edit")}
                        onClick={() => setIsProfileDropdown(false)}
                    >
                        <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Edit Profile</span>
                    </Dropdown.Item>

                    <Dropdown.Item
                        as={Link}
                        href={route("admin.site-settings.edit")}
                        onClick={() => setIsProfileDropdown(false)}
                    >
                        <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle">Site settings</span>
                    </Dropdown.Item>

                    <Dropdown.Divider />
                    <Link
                        className="dropdown-item"
                        as="button"
                        method="post"
                        href={route("logout")}
                        onClick={() => setIsProfileDropdown(false)}
                    >
                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle" data-key="t-logout">
                            Logout
                        </span>
                    </Link>
                </Dropdown.Menu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
