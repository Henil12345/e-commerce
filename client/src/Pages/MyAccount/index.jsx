import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, CircularProgress } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import { Collapse } from "react-collapse";
import AccountSidebar from "../../components/AccountSidebar";
// adjust the relative path so it points at your App.js
import { MyContext } from "../../App";
import { editData, postData } from "../../utils/api";
// import "react-phone-number-input/style.css"; // if you need the default styles

const MyAccount = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [phone, setPhone] = useState(profile.mobile);

  const [passwords, setPasswords] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, [context.isLogin, navigate]);

  // populate form when userData arrives
  useEffect(() => {
    if (context.userData?._id) {
      const { name, email, mobile, signUpWithGoogle } = context.userData;
      setProfile({ name, email, mobile });
      setPhone(mobile);
      setPasswords((p) => ({ ...p, email }));
    }
  }, [context.userData]);

  const isProfileValid = profile.name && profile.email && profile.mobile;
  const isPwdValid =
    (!context.userData.signUpWithGoogle && passwords.oldPassword) &&
    passwords.newPassword &&
    passwords.newPassword === passwords.confirmPassword;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setProfile((p) => ({ ...p, mobile: value }));
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    if (!isProfileValid) {
      return context.alertBox("error", "Please fill in all required fields");
    }
    setLoadingProfile(true);
    try {
      const res = await editData(`/api/user/${context.userData._id}`, profile, { withCredentials: true });
      context.alertBox(res.error ? "error" : "success", res.data.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (!isPwdValid) {
      return context.alertBox("error", "Please check your password entries");
    }
    setLoadingPassword(true);
    try {
      const res = await postData(`/api/user/reset-password`, passwords, { withCredentials: true });
      context.alertBox(res.error ? "error" : "success", res.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <section className="py-3 lg:py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[20%]">
          <AccountSidebar />
        </div>

        <div className="w-full lg:w-[50%] space-y-5">
          {/* Profile */}
          <div className="card bg-white p-5 shadow-md rounded-md">
            <div className="flex items-center mb-3">
              <h2>My Profile</h2>
              <Button className="ml-auto" onClick={() => setShowPwdForm((v) => !v)}>
                Change Password
              </Button>
            </div>
            <form onSubmit={submitProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                label="Full Name"
                name="name"
                size="small"
                value={profile.name}
                disabled={loadingProfile}
                onChange={handleProfileChange}
              />
              <TextField
                label="Email"
                name="email"
                size="small"
                value={profile.email}
                disabled
              />
              <PhoneInput
                defaultCountry="IN"
                value={phone}
                disabled={loadingProfile}
                onChange={handlePhoneChange}
              />
              <div className="col-span-full flex justify-end">
                <Button
                  type="submit"
                  disabled={!isProfileValid || loadingProfile}
                  className="btn-org btn-sm w-[150px]"
                >
                  {loadingProfile ? <CircularProgress size={20} /> : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <Collapse isOpened={showPwdForm}>
            <div className="card bg-white p-5 shadow-md rounded-md">
              <h2 className="mb-3">Change Password</h2>
              <form onSubmit={submitPassword} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {!context.userData.signUpWithGoogle && (
                  <TextField
                    label="Old Password"
                    name="oldPassword"
                    type="password"
                    size="small"
                    value={passwords.oldPassword}
                    disabled={loadingPassword}
                    onChange={handlePwdChange}
                  />
                )}
                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  size="small"
                  value={passwords.newPassword}
                  disabled={loadingPassword}
                  onChange={handlePwdChange}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  size="small"
                  value={passwords.confirmPassword}
                  disabled={loadingPassword}
                  onChange={handlePwdChange}
                />
                <div className="col-span-full flex justify-end">
                  <Button
                    type="submit"
                    disabled={!isPwdValid || loadingPassword}
                    className="btn-org btn-sm w-[200px]"
                  >
                    {loadingPassword ? <CircularProgress size={20} /> : "Change Password"}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
