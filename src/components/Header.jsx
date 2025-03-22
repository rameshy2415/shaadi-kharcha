const Header = () => {
    return (
      <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <WeddingRingIcon />
            <span className="text-xl font-bold ml-2">Wedding Expense Tracker</span>
          </div>
          <div className="text-sm">
            <p className="opacity-90">Planning your special day made easier</p>
          </div>
        </div>
      </header>
    );
  };

  export default Header;

  // Icon component for the brand logo
const WeddingRingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <circle cx="8" cy="12" r="4" />
      <circle cx="16" cy="12" r="4" />
    </svg>
  );