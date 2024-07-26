import { Footer } from 'flowbite-react';
import React from 'react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";

const FooterComp = () => {
    return (
        <Footer container className='border border-t-8 dark:bg-black'>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="#"
              src="https://seeklogo.com/images/B/blogger_B-logo-47610B2F87-seeklogo.com.png"
              alt="Logo"
              name="Blogger Hunt!"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Flowbite</Footer.Link>
                <Footer.Link href="#">Tailwind CSS</Footer.Link>
                <Footer.Link href="#">React</Footer.Link>
                <Footer.Link href="#">Redux</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/Johnvilin-Sibina">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
                <Footer.Link href="#">LinkedIn</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between font-bold">
          <Footer.Copyright href="#" by="Johnvilin Sibina™" year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="https://github.com/Johnvilin-Sibina" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
            <Footer.Icon href="#" icon={BsLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
    );
};

export default FooterComp;