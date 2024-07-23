import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
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
          <p className="text-sm mt-6">You can sign up with your and password or you can use Google. **This is a demo project**</p>
        </div>
        <div className="flex-1">
            <form className="flex flex-col gap-4">
                <div>
                    <Label value='Username' />
                    <TextInput type='text' placeholder="Enter Your User Name" id="username" />
                </div>
                <div>
                    <Label value='Email' />
                    <TextInput type='email' placeholder="name@company.com" id="email" />
                </div>
                <div>
                    <Label value='Password' />
                    <TextInput type='password' placeholder="Enter Your Password" id="password" />
                </div>
                    <Button gradientDuoTone="purpleToPink" type="submit">Sign Up</Button>
            </form>
            <div className="flex gap-2 text-sm mt-4">
                <span>Already Have An Account?</span>
                <Link to='/signin' className='text-blue-500'>Sign In</Link> 
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
