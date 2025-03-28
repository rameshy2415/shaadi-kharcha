import React from 'react';
import { FileText, Check, X, AlertTriangle } from 'lucide-react';

const TermsAndConditions = () => {
  const keyTerms = [
    {
      icon: <Check className="text-green-500" size={24} />,
      title: "Account Responsibility",
      description: "Users are responsible for maintaining the confidentiality of their account credentials."
    },
    {
      icon: <X className="text-red-500" size={24} />,
      title: "Prohibited Use",
      description: "Users may not use the platform for illegal activities or to violate others' rights."
    },
    {
      icon: <AlertTriangle className="text-yellow-500" size={24} />,
      title: "Limitation of Liability",
      description: "Our platform is provided 'as is' and we are not liable for any indirect damages."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          By using Wedding Expenses Tracker, you agree to the following terms and conditions.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {keyTerms.map((term, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">{term.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{term.title}</h3>
              <p className="text-gray-600">{term.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Wedding Expenses Tracker, you accept and agree to be bound 
              by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Accounts</h2>
            <p>
              You agree to:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Conduct</h2>
            <p>
              You may not:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to other users' data</li>
              <li>Interfere with the operation of the platform</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;