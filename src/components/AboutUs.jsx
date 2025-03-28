import React from 'react';
import { Calculator, Heart, Users, Lock } from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      icon: <Calculator className="text-pink-500" size={32} />,
      title: "Comprehensive Budget Tracking",
      description: "Effortlessly manage and track every aspect of your wedding expenses with our intuitive platform."
    },
    {
      icon: <Users className="text-pink-500" size={32} />,
      title: "Collaborative Planning",
      description: "Invite family and your partner to collaborate on wedding budget and expense tracking."
    },
    {
      icon: <Lock className="text-pink-500" size={32} />,
      title: "Secure Financial Management",
      description: "Protect your wedding budget information with advanced security features and privacy controls."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Wedding Expenses Tracker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We are passionate about helping couples navigate the financial aspects of their wedding 
          planning journey with transparency, ease, and joy.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg leading-relaxed">
            At Wedding Expenses Tracker, our mission is to transform wedding financial planning 
            from a stressful experience to an exciting and transparent journey. We believe that 
            by providing powerful, user-friendly tools, we can help couples focus on what truly 
            matters - celebrating their love and creating lifelong memories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;