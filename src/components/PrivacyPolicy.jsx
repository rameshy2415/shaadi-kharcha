import React from 'react';
import { Shield, Lock, Database, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  const privacyPoints = [
    {
      icon: <Shield className="text-pink-500" size={32} />,
      title: "Data Protection",
      description: "We employ industry-standard encryption and security measures to protect your personal and financial information."
    },
    {
      icon: <Lock className="text-pink-500" size={32} />,
      title: "Confidentiality",
      description: "Your data is strictly confidential. We never sell or share your personal information with third parties without consent."
    },
    {
      icon: <Database className="text-pink-500" size={32} />,
      title: "Data Usage",
      description: "We collect and use data solely to improve your wedding expense tracking experience and provide personalized support."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          At Wedding Expenses Tracker, we are committed to protecting your privacy and ensuring 
          the security of your personal information.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {privacyPoints.map((point, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">{point.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, 
              use our services, or contact our support team. This may include:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Personal contact information</li>
              <li>Wedding budget and expense details</li>
              <li>Communication preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Provide and improve our wedding expense tracking services</li>
              <li>Communicate with you about your account and services</li>
              <li>Respond to your customer support requests</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;