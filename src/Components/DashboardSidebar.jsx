import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../Redux/Slice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const DashboardSidebar = () => {
  const { currentuser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab");
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);

  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };

  return (
    <Sidebar className="w-full md:w-58">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentuser.rest.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentuser.rest.isAdmin && (
            <Link to='/createpost'>
              <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              labelColor="dark"
              as="div"
            >
              Posts
            </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
