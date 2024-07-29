import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../Redux/Slice/userSlice";
import { Link } from "react-router-dom";

const DashboardProfile = () => {
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null); //State to upload image from the local system
  const [imageFileUrl, setImageFileUrl] = useState(null); //State to handle the image url - that will be stored in firebase
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); //State to handle the progressbar
  const [imageFileUploadError, setImageFileUploadError] = useState(null); //State to handle error in file upload
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUseSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  //Onchange in the image uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  //Uploading process
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //Code for firebse image upload and storage
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); //10.679464
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File size must be less than 2MB)."
        );
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  //Onchange in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //Update User
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUseSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      const response = await fetch(
        `http://localhost:5000/api/user/update/${currentuser.rest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUseSuccess("User Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  //Signout
  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };

  //Delete account
  const handleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await fetch(
        `http://localhost:5000/api/user/delete/${currentuser.rest._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,150,190,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentuser.rest.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😲OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          type="text"
          id="userName"
          placeholder="User Name"
          defaultValue={currentuser.rest.userName}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentuser.rest.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading" : "Update"}
        </Button>
        {currentuser.rest.isAdmin && (
          <Link to='/createpost'>
            <Button
            type='submit'
            gradientDuoTone='purpleToPink'
            className='w-full'>Create Post</Button>
          </Link>
        )}
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">😎Yaaa!</span>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">😲OOPS!</span>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">😲OOPS!</span>
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
