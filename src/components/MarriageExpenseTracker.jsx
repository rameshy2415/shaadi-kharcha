import { useState, useEffect } from "react";
import { expenseAPI } from "../services/api";
const MarriageExpenseTracker = () => {
  // State for expenses, received payments, and form inputs
  const [expenses, setExpenses] = useState([]);
  const [receivedMoney, setReceivedMoney] = useState([]);
  const [expenseFormData, setExpenseFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [receivedFormData, setReceivedFormData] = useState({
    from: "",
    amount: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [activeTab, setActiveTab] = useState("expenses");

  // Categories for expenses
  const categories = [
    "Venue",
    "Catering",
    "Attire",
    "Photography",
    "Decoration",
    "Entertainment",
    "Transportation",
    "Gifts",
    "Other",
  ];

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await expenseAPI.getExpenses();
        setExpenses(res.data);
        //setLoading(false);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        //setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle expense form changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseFormData({
      ...expenseFormData,
      [name]: value,
    });
  };

  // Handle received money form changes
  const handleReceivedChange = (e) => {
    const { name, value } = e.target;
    setReceivedFormData({
      ...receivedFormData,
      [name]: value,
    });
  };

  // Add new expense
  const addExpense = async (e) => {
    e.preventDefault();
    if (!expenseFormData.description || !expenseFormData.amount) return;

    const newExpense = {
      id: Date.now(),
      ...expenseFormData,
      amount: parseFloat(expenseFormData.amount),
    };

    console.log("New Expenses data", { ...newExpense });
    //setExpenses([...expenses, newExpense]);

    try {
      let res;
      res = await expenseAPI.addExpense(newExpense);
      setExpenses([res.data, ...expenses]);
    } catch (err) {
      console.error("Failed to save expense", err);
    }

    // Reset form data after submission
    setExpenseFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Add new received money
  const addReceivedMoney = (e) => {
    e.preventDefault();
    if (!receivedFormData.from || !receivedFormData.amount) return;

    const newReceived = {
      id: Date.now(),
      ...receivedFormData,
      amount: parseFloat(receivedFormData.amount),
    };

    setReceivedMoney([...receivedMoney, newReceived]);

    // Reset form data after submission
    setReceivedFormData({
      from: "",
      amount: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Delete expense
  /*   const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }; */

  // Handle expense deletion
  const deleteExpense = async (id,_id) => {
    try {
      console.info("Id to be deleted", id);
      await expenseAPI.deleteExpense(_id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  // Delete received money
  const deleteReceived = (id) => {
    setReceivedMoney(receivedMoney.filter((received) => received.id !== id));
  };

  // Calculate totals
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalReceived = receivedMoney.reduce(
    (sum, received) => sum + received.amount,
    0
  );
  const balance = totalReceived - totalExpenses;

  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    if (!acc[category]) acc[category] = 0;
    acc[category] += expense.amount;
    return acc;
  }, {});

  // Format amount in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        {/* Conditional rendering based on view state */}
        <>
          {/* Summary Cards - Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-400">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Expenses
              </h2>
              <p className="text-2xl font-bold text-red-600">
                {formatINR(totalExpenses)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-400">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Received
              </h2>
              <p className="text-2xl font-bold text-green-600">
                {formatINR(totalReceived)}
              </p>
            </div>
            <div
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                balance >= 0 ? "border-green-400" : "border-red-400"
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
              <p
                className={`text-2xl font-bold ${
                  balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatINR(balance)}
              </p>
            </div>
          </div>

          {/* Mobile-friendly tabs */}
          <div className="bg-white rounded-t-lg shadow-md mb-6">
            <div className="flex flex-wrap border-b">
              <button
                onClick={() => setActiveTab("expenses")}
                className={`py-3 px-6 text-sm sm:text-base font-medium ${
                  activeTab === "expenses"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className={`py-3 px-6 text-sm  sm:text-base font-medium ${
                  activeTab === "received"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Received Money
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`py-3 px-6 text-sm sm:text-base font-medium ${
                  activeTab === "summary"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Summary
              </button>
            </div>
          </div>

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              <form
                onSubmit={addExpense}
                className="bg-white p-6 rounded-lg shadow-md mb-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Add New Expense
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={expenseFormData.description}
                      onChange={handleExpenseChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                      placeholder="Expense description"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={expenseFormData.amount}
                      onChange={handleExpenseChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={expenseFormData.category}
                      onChange={handleExpenseChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={expenseFormData.date}
                      onChange={handleExpenseChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Add Expense
                </button>
              </form>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Expense List
                </h3>
                {expenses.length === 0 ? (
                  <p className="text-gray-500 italic">No expenses added yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 border text-left">Date</th>
                          <th className="p-2 border text-left">Description</th>
                          <th className="p-2 border text-left">Category</th>
                          <th className="p-2 border text-right">Amount</th>
                          <th className="p-2 border text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr
                            key={expense.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 border">{expense.date}</td>
                            <td className="p-2 border">
                              {expense.description}
                            </td>
                            <td className="p-2 border">
                              {expense.category || "Uncategorized"}
                            </td>
                            <td className="p-2 border text-right">
                              {formatINR(expense.amount)}
                            </td>
                            <td className="p-2 border text-center">
                              <button
                                onClick={() => deleteExpense(expense.id,expense._id)}
                                className="text-red-500 hover:text-red-700"
                                aria-label="Delete expense"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Received Money Tab */}
          {activeTab === "received" && (
            <div>
              <form
                onSubmit={addReceivedMoney}
                className="bg-white p-6 rounded-lg shadow-md mb-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Add Money Received
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      From
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={receivedFormData.from}
                      onChange={handleReceivedChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                      placeholder="Person or source"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={receivedFormData.amount}
                      onChange={handleReceivedChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Notes
                    </label>
                    <input
                      type="text"
                      name="notes"
                      value={receivedFormData.notes}
                      onChange={handleReceivedChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                      placeholder="Any additional notes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={receivedFormData.date}
                      onChange={handleReceivedChange}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Add Received Money
                </button>
              </form>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Received Money List
                </h3>
                {receivedMoney.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No received money added yet
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 border text-left">Date</th>
                          <th className="p-2 border text-left">From</th>
                          <th className="p-2 border text-left">Notes</th>
                          <th className="p-2 border text-right">Amount</th>
                          <th className="p-2 border text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedMoney.map((received) => (
                          <tr
                            key={received.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 border">{received.date}</td>
                            <td className="p-2 border">{received.from}</td>
                            <td className="p-2 border">{received.notes}</td>
                            <td className="p-2 border text-right">
                              {formatINR(received.amount)}
                            </td>
                            <td className="p-2 border text-center">
                              <button
                                onClick={() => deleteReceived(received.id)}
                                className="text-red-500 hover:text-red-700"
                                aria-label="Delete received payment"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Financial Summary
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">
                    Expenses by Category
                  </h3>
                  {Object.keys(expensesByCategory).length === 0 ? (
                    <p className="text-gray-500 italic">
                      No expenses added yet
                    </p>
                  ) : (
                    <div>
                      {Object.entries(expensesByCategory).map(
                        ([category, amount]) => (
                          <div
                            key={category}
                            className="flex justify-between py-2 border-b"
                          >
                            <span className="text-gray-700">{category}</span>
                            <span className="font-medium">
                              {formatINR(amount)}
                            </span>
                          </div>
                        )
                      )}
                      <div className="flex justify-between py-3 mt-2 font-bold">
                        <span>Total</span>
                        <span className="text-red-600">
                          {formatINR(totalExpenses)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">
                    Overall Balance
                  </h3>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Total Expenses</span>
                    <span className="font-medium text-red-600">
                      {formatINR(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-700">Total Received</span>
                    <span className="font-medium text-green-600">
                      {formatINR(totalReceived)}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 mt-2 font-bold">
                    <span>Balance</span>
                    <span
                      className={
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {formatINR(balance)}
                    </span>
                  </div>
                  {balance < 0 && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">
                        You need {formatINR(Math.abs(balance))} more to cover
                        all expenses.
                      </p>
                    </div>
                  )}
                  {balance > 0 && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-600">
                        You have {formatINR(balance)} excess after covering all
                        expenses.
                      </p>
                    </div>
                  )}
                  {balance === 0 && expenses.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-600">
                        Your budget is perfectly balanced!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default MarriageExpenseTracker;
