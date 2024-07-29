import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi2";


const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  //Image upload
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please Select an Image");
        return;
      }
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0)); //10.679464
        },
        (error) => {
          setImageFileUploadError("Image Upload Failed");
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image upload failed");
      setImageFileUploadProgress(null);
      console.log(error);
    }
  };

  //Create Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //To convert html to content
      const strippedContent = formData.content.replace(/<[^>]+>/g,'');
      const response = await fetch(
        "http://localhost:5000/api/post/create-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("Token"),
          },
          body: JSON.stringify({ ...formData, content: strippedContent }),
        }
      );
      const data = await response.json();
      if(!response.ok){
        setPublishError(data.message)
        return
      }
      else{
        setPublishError(null)
        navigate('/blogs')
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Enter the title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😲OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write your blog..."
          required
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">
          Publish
        </Button>
        {publishError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">😲OOPS!</span>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
