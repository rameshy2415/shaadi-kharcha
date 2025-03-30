import React, { useState, useContext } from "react";
import { Send, Paperclip } from "lucide-react";
import { sendEmailAPI } from "../services/api";
import { UserContext } from "../context/AuthProvider";
import { ApplicationContext } from "../context/ApplicationContextProvider"

const EmailUs = () => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const { loading, setLoading}  =  useContext(ApplicationContext)
  const [formData, setFormData] = useState({
    to: "tech.insights15@gmail.com",
    subject: "",
    message: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      attachment: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your email submission logic here
    console.log("Email form submitted:", formData);
    // Reset form after submission
    try {
      await sendEmailAPI.sendMail(formData);
      setMessage({
        type: "success",
        text: "Email sent! We'll get back to you as soon as possible.",
      });
      setLoading(false);
      setFormData({subject: "", message: "", attachment: null });

    } catch (err) {
      setLoading(false);
      setMessage( {
        type: "error",
        text: err.response?.data?.message || "Server error. Please try again later.",
      });
    }
    setTimeout(()=>{
      setMessage({
        type: "",
        text: "",
      });
    },5000)
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">Email Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Send a direct email to our support team. We'll get back to you as soon
          as possible.
        </p>
        {message.text && (
        <div
          className={`mb-4 p-3 max-w-2xl mx-auto rounded mt-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">To</label>
            <input
              type="email"
              name="to"
              placeholder="tech.insights15@gmail.com"
              value={formData.to}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Enter email subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              placeholder="Type your message here"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Attachment</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                name="attachment"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Paperclip className="text-gray-500" size={20} />
                <span>
                  {formData.attachment
                    ? formData.attachment.name
                    : "Choose File"}
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 rounded-md cursor-pointer hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Send size={20} />
            <span>{loading ? 'Sending..': 'Send Email'} </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailUs;
