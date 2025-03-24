const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 mt-15">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          Welcome to Wedding Expense Tracker
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Planning a wedding involves managing numerous expenses and
          contributions. Our app helps you track every rupee spent and received,
          ensuring your budget stays on track for your special day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-purple-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
          <p className="text-gray-600">
            Record and categorize all your wedding expenses in one place.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-purple-600"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Manage Contributions</h3>
          <p className="text-gray-600">
            Keep track of gifts and financial contributions from family and
            friends.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100 text-center">
          <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-purple-600"
            >
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Budget Insights</h3>
          <p className="text-gray-600">
            Get a clear overview of your wedding finances with detailed
            breakdowns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
