import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/api/post/get-posts");
    const data = await response.json();
    setBlogs(data);
  };
  return (
    <div className="flex flex-row gap-3 overflow-hidden">
      {blogs.map((ele, index) => {
        return (
          <div key={index}>
            <Card className="max-w-sm" imgAlt="image" imgSrc={ele.image}>
              <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.category}
              </h4>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {ele.content}
              </p>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default Blogs;