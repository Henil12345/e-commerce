import { Button } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { IoHomeOutline, IoSearch } from "react-icons/io5";
import { LuHeart } from "react-icons/lu";
import { BsBagCheck } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { MdOutlineFilterAlt } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { MyContext } from '../../../App';

const MobileNav = () => {
    const context = useContext(MyContext);
    const location = useLocation();

    useEffect(() => {
        const show = ["/products", "/search"].includes(location.pathname);
        context?.setisFilterBtnShow(show);
    }, [location]);

    const openFilters = () => {
        context?.setOpenFilter(true);
        context?.setOpenSearchPanel(false);
    };

    const navItems = [
        { to: "/", icon: <IoHomeOutline size={20} />, label: "Home" },
        { to: "/my-list", icon: <LuHeart size={20} />, label: "Wishlist" },
        { to: "/my-orders", icon: <BsBagCheck size={20} />, label: "Orders" },
        { to: "/my-account", icon: <FiUser size={20} />, label: "Account" }
    ];

    return (
        <div className='lg:hidden block'>
            <div className='mobileNav bg-white px-2 py-1 w-full flex justify-around items-center fixed bottom-0 left-0 z-[51] shadow-md border-t border-gray-200'>
                {navItems.map(({ to, icon, label }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-primary" : "text-gray-600"}`}
                        onClick={() => context?.setOpenSearchPanel(false)}
                    >
                        <Button className="!min-w-0 !p-0 !flex-col !capitalize !w-full">
                            {icon}
                            <span className='text-[10px]'>{label}</span>
                        </Button>
                    </NavLink>
                ))}

                <Button
                    className="!min-w-0 !p-0 !flex-col !text-gray-600"
                    onClick={() => context?.setOpenSearchPanel(true)}
                >
                    <IoSearch size={20} />
                    <span className='text-[10px]'>Search</span>
                </Button>

                {context?.isFilterBtnShow && (
                    <Button
                        onClick={openFilters}
                        className="!min-w-0 !p-2 !bg-primary !rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 shadow-lg"
                    >
                        <MdOutlineFilterAlt size={20} className="text-white" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MobileNav;
