import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../Redux/Slice/userSlice";
import OAuth from "../Components/OAuth";

const Signin = () => {
  //State to handle form
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch()
  const {loading, error:errorMessage} = useSelector((state)=>state.user)
  const navigate = useNavigate();

  const handleChange = (e) => {
    //console.log(e.tarrget.value)
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    //console.log(formData)
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out the fields"));
    }
    try {
        dispatch(signInStart())
      const response = await fetch(
        "http://localhost:5000/api/auth/login-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success === false) {
        return dispatch(signInFailure(((data.message))));
      }
      if (response.ok) {
        localStorage.setItem('Token',data.token)
        dispatch(signInSuccess(data))
        navigate("/blogs");
      }
    } catch (error) {
        dispatch(signInFailure(((error.message))));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:item-center gap-5">
        <div className="flex-1">
          <div className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-violet-600 via-fuchsia-700 to-pink-500 rounded-lg text-white">
              Blogger
            </span>
            Hunt!
          </div>
          <p className="text-sm mt-6">
            You can sign in with your email and password or you can use Google. 
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter Your Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    color="purple"
                    aria-label="Purple spinner example"
                    size="sm"
                  />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-4">
            <span>Don't Have An Account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" icon={HiInformationCircle} className='mt-5'>
              <span className="font-medium me-2">😲OOPS!</span>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;