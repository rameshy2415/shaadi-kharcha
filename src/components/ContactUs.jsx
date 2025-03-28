import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Contact form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We're here to help! Reach out to us with any questions, suggestions, or support needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="bg-pink-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="text-pink-500" size={24} />
              <div>
                <span className="font-semibold">Email</span>
                <p className="text-gray-600">support@weddingexpensestracker.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="text-pink-500" size={24} />
              <div>
                <span className="font-semibold">Phone</span>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="text-pink-500" size={24} />
              <div>
                <span className="font-semibold">Address</span>
                <p className="text-gray-600">123 Wedding Lane, Love City, RS 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button 
              type="submit" 
              className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;