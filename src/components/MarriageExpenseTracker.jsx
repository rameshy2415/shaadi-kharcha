import { useState, useEffect, useContext } from "react";
import { expenseAPI, receiveMoneyAPI } from "../services/api";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { ApplicationContext } from "../context/ApplicationContextProvider";
import Loader from "./Loader.jsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { UserContext } from "../context/AuthProvider";

const MarriageExpenseTracker = () => {
  // State for expenses, received payments, and form inputs
  const { loading, setLoading, message, setMessage } =
    useContext(ApplicationContext);
  const { setAuthFlag, setUser } = useContext(UserContext);
  const [expandFlag, setExpandFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
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
    "Attire",
    "Utensils",
    "Venue",
    "Catering",
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
        let res;

        if (activeTab === "expenses") {
          res = await expenseAPI.getExpenses();
          setExpenses(res.data);
        }

        if (activeTab === "received") {
          res = await receiveMoneyAPI.getReceivedMoney();
          setReceivedMoney(res.data);
        }

        const token = localStorage.getItem("token");
        if (token) {
          const user = JSON.parse(localStorage.getItem("user"));
          setUser({ ...user });
          token ? setAuthFlag(true) : setAuthFlag(false);
        }
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };

    fetchExpenses();
  }, [activeTab]);

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

  // Add/Edit new expense
  const addOrUpdateExpense = async (e) => {
    e.preventDefault();
    if (!expenseFormData.description || !expenseFormData.amount) return;
    setMessage({ type: "", text: "" });

    const newExpense = {
      ...expenseFormData,
      amount: parseFloat(expenseFormData.amount),
    };
    //setExpenses([...expenses, newExpense]);

    try {
      let res;
      setLoading(true);
      let msg = "";
      if (editFlag) {
        res = await expenseAPI.updateExpense(
          expenseFormData._id,
          expenseFormData
        );
        msg = "updated";
        setExpenses(
          expenses.filter((expense) => expense._id !== expenseFormData._id)
        );
      } else {
        res = await expenseAPI.addExpense(newExpense);
        msg = "Added";
      }

      setMessage({
        type: "success",
        text: "Successfully " + msg,
      });
      setExpenses((prevExpenses) => [res.data, ...prevExpenses]);
      setLoading(false);
      setEditFlag(false);
    } catch (err) {
      setLoading(false);
      setEditFlag(false);
      console.error("Failed to edit/save expense", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Server error. Please try again later.",
      });
    }

    // Reset form data after submission
    setExpenseFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  // Add/Edit new received money
  const addOrUpdateReceivedMoney = async (e) => {
    e.preventDefault();
    if (!receivedFormData.from || !receivedFormData.amount) return;
    setMessage({ type: "", text: "" });
    const newReceived = {
      id: Date.now(),
      ...receivedFormData,
      amount: parseFloat(receivedFormData.amount),
    };

    try {
      let res;
      let msg = "";
      setLoading(true);

      if (editFlag) {
        res = await receiveMoneyAPI.updateReceivedMoney(
          receivedFormData._id,
          receivedFormData
        );
        msg = "updated";
        setReceivedMoney(
          receivedMoney.filter((item) => item._id !== receivedFormData._id)
        );
      } else {
        res = await receiveMoneyAPI.addReceivedMoney(newReceived);
        msg = "Added";
      }
      setMessage({
        type: "success",
        text: "Successfully " + msg,
      });
      setLoading(false);
      setEditFlag(false);
      setReceivedMoney((prevReceivedMoney) => [...prevReceivedMoney, res.data]);
    } catch (err) {
      setLoading(false);
      setEditFlag(false);
      console.error("Failed to save receive money", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Server error. Please try again later.",
      });
    }

    // Reset form data after submission
    setReceivedFormData({
      from: "",
      amount: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  // Delete expense
  const deleteExpense = async (_id) => {
    setMessage({ type: "", text: "" });
    try {
      await expenseAPI.deleteExpense(_id);
      setMessage({
        type: "success",
        text: "Successfully deleted",
      });
      setExpenses(expenses.filter((expense) => expense._id !== _id));
    } catch (err) {
      console.error("Failed to delete expense", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Server error. Please try again later.",
      });
    }
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  // Edit expense
  const editExpense = async (expense) => {
    setExpandFlag(true);
    setEditFlag(true);
    setExpenseFormData({
      ...expense,
    });
  };

  // Delete received money
  const deleteReceived = async (id) => {
    setMessage({ type: "", text: "" });
    try {
      await receiveMoneyAPI.deleteReceivedMoney(id);
      setMessage({
        type: "success",
        text: "Successfully deleted",
      });
      setReceivedMoney(
        receivedMoney.filter((receivedMoney) => receivedMoney._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete received money", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Server error. Please try again later.",
      });
    }
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3000);
  };

  // Edit received money
  const editReceived = async (receiveMoney) => {
    setExpandFlag(true);
    setEditFlag(true);
    setReceivedFormData({
      ...receiveMoney,
    });
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

  const generatePDFReport = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Calculate totals
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalReceived = receivedMoney.reduce(
      (sum, money) => sum + money.amount,
      0
    );
    const netBalance = totalReceived - totalExpenses;
    doc.setFont("courier");

    // Report Title
    doc.setFontSize(22);
    doc.text("Marriage Expenses Report", 15, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toISOString().split("T")[0]}`, 15, 30);

    // Expenses Section
    doc.setFontSize(16);
    doc.text("Expenses Details", 15, 50);
    autoTable(doc, {
      startY: 55,
      head: [["Date", "Description", "Category", "Amount (₹)"]],
      body: expenses.map((expense) => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount.toLocaleString(),
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Received Money Section
    const expensesEndY = doc.lastAutoTable?.finalY + 20;
    doc.setFontSize(16);
    doc.text("Received Money Details", 15, expensesEndY);
    autoTable(doc, {
      startY: expensesEndY + 5,
      head: [["Date", "From", "Notes", "Amount (₹)"]],
      body: receivedMoney.map((money) => [
        money.date,
        money.from,
        money.notes,
        money.amount.toLocaleString(),
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [39, 174, 96] },
    });

    // Summary Section
    const receivedMoneyEndY = doc.lastAutoTable?.finalY + 20;
    doc.setFontSize(16);
    doc.text("Financial Summary", 15, receivedMoneyEndY);

    autoTable(doc, {
      startY: receivedMoneyEndY + 5,
      head: [["Description", "Amount (₹)"]],
      body: [
        ["Total Expenses", totalExpenses.toLocaleString()],
        ["Total Received", totalReceived.toLocaleString()],
        ["Net Balance", netBalance.toLocaleString()],
      ],
      theme: "plain",
      styles: { fontSize: 12 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
    });

    // Save the PDF
    doc.save("Marriage_Expenses_Report.pdf");
  };

  const tabChangeHandler = (value) => {
    setActiveTab(value);
    setExpandFlag(false);
    setEditFlag(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-15">
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
            <div className="flex justify-around md:justify-start flex-wrap ">
              <button
                onClick={() => tabChangeHandler("expenses")}
                className={`py-3 px-2 md:px-6 text-sm sm:text-base font-medium hover:cursor-pointer ${
                  activeTab === "expenses"
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => tabChangeHandler("received")}
                className={`py-3 px-2 md:px-6 text-sm  sm:text-base font-medium hover:cursor-pointer ${
                  activeTab === "received"
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Received Money
              </button>
              <button
                onClick={() => tabChangeHandler("summary")}
                className={`py-3 px-2 md:px-6 text-sm sm:text-base font-medium hover:cursor-pointer ${
                  activeTab === "summary"
                    ? "text-pink-600 border-b-2 border-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Summary
              </button>
            </div>
          </div>

          {/* Success/Error message */}
          {message.text && (
            <div
              className={`max-w-sm mb-2 p-3 rounded text-center mx-auto text-sm md:text-md ${
                message.type === "success"
                  ? "bg-green-400 text-white border border-green-200"
                  : "bg-red-400 text-white border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Expenses Tab */}
          {activeTab === "expenses" && (
            <div>
              <form
                onSubmit={addOrUpdateExpense}
                className="bg-white p-6 rounded-lg shadow-md mb-6"
              >
                <h2
                  className="flex justify-between text-xl font-semibold  text-gray-800 hover:cursor-pointer"
                  onClick={() => setExpandFlag((prev) => !prev)}
                >
                  <span>{editFlag ? "Update Expense" : "Add New Expense"}</span>
                  {expandFlag ? (
                    <ChevronUpIcon className="h-6 w-6" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6" />
                  )}
                </h2>
                {expandFlag && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                      disabled={loading}
                      type="submit"
                      className="flex items-center justify-center cursor-pointer gap-3  mt-4 px-4 py-2  bg-pink-500 text-white rounded font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-900"
                    >
                      {loading
                        ? editFlag
                          ? "Updating..."
                          : "Adding..."
                        : editFlag
                        ? "Update Expense"
                        : "Add Expense"}

                      {loading && <Loader />}
                    </button>
                  </>
                )}
              </form>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Expense List
                </h3>
                {expenses.length === 0 ? (
                  <p className="text-gray-500 italic">No expenses added yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-400">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 border border-gray-300 text-left hidden md:table-cell">
                            Date
                          </th>
                          <th className="p-2 border border-gray-300 text-left">
                            Description
                          </th>
                          <th className="p-2 border border-gray-300 text-left hidden md:table-cell">
                            Category
                          </th>
                          <th className="p-2 border border-gray-300 text-right">
                            Amount
                          </th>
                          <th className="p-2 border border-gray-300 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 border border-gray-300 hidden md:table-cell">
                              {expense.date}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {expense.description}
                            </td>
                            <td className="p-2 border border-gray-300 hidden md:table-cell">
                              {expense.category || "Uncategorized"}
                            </td>
                            <td className="p-2 border border-gray-300 text-right">
                              {formatINR(expense.amount)}
                            </td>
                            <td className="p-2  border-gray-300 text-center border">
                              <div className="flex items-center justify-center gap-x-2">
                                <PencilSquareIcon
                                  className="size-4 md:size-5 cursor-pointer border-0 text-blue-500 hover:text-blue-700"
                                  onClick={() => editExpense(expense)}
                                />
                                <TrashIcon
                                  className="size-4 md:size-5 cursor-pointer border-0 text-red-500 hover:text-red-700"
                                  onClick={() => deleteExpense(expense._id)}
                                />
                              </div>
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
                onSubmit={addOrUpdateReceivedMoney}
                className="bg-white p-6 rounded-lg shadow-md mb-6"
              >
                <h2
                  className="flex justify-between text-xl font-semibold  text-gray-800 hover:cursor-pointer"
                  onClick={() => setExpandFlag((prev) => !prev)}
                >
                  <span>
                    {editFlag ? "Update Money Received" : "Add Money Received"}{" "}
                  </span>
                  {expandFlag ? (
                    <ChevronUpIcon className="h-6 w-6" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6" />
                  )}
                </h2>
                {expandFlag && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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
                      className="flex items-center justify-center gap-3 mt-4 cursor-pointer bg-pink-500 text-white px-4 py-2 rounded font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    >
                      {loading
                        ? editFlag
                          ? "Updating..."
                          : "Adding..."
                        : editFlag
                        ? "Update Received Money"
                        : "Add Received Money"}
                      {loading && <Loader />}
                    </button>
                  </>
                )}
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
                    <table className="w-full border-collapse  border-gray-400">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="p-2 border text-left border-gray-300 hidden md:table-cell">
                            Date
                          </th>
                          <th className="p-2 border text-left border-gray-300">
                            From
                          </th>
                          <th className="p-2 border text-left border-gray-300 hidden md:table-cell">
                            Notes
                          </th>
                          <th className="p-2 border text-right border-gray-300">
                            Amount
                          </th>
                          <th className="p-2 border text-center border-gray-300">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivedMoney.map((received) => (
                          <tr
                            key={received._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-2 border border-gray-300 hidden md:table-cell">
                              {received.date}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {received.from}
                            </td>
                            <td className="p-2 border border-gray-300 hidden md:table-cell">
                              {received.notes}
                            </td>
                            <td className="p-2 border text-right border-gray-300">
                              {formatINR(received.amount)}
                            </td>
                            <td className="p-2 border text-center border-gray-300">
                              {/* <button
                                onClick={() => deleteReceived(received._id)}
                                className="text-red-500 cursor-pointer hover:text-red-700"
                                aria-label="Delete received payment"
                              >
                                Delete
                              </button> */}

                              <div className="flex items-center justify-center gap-x-2">
                                <PencilSquareIcon
                                  className="size-4 md:size-5 cursor-pointer border-0 text-blue-500 hover:text-blue-700"
                                  onClick={() => editReceived(received)}
                                />
                                <TrashIcon
                                  className="size-4 md:size-5 cursor-pointer border-0 text-red-500 hover:text-red-700"
                                  onClick={() => deleteReceived(received._id)}
                                />
                              </div>
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
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center md:text-left">
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

                  <div className="flex justify-between py-3 mt-2 font-bold">
                    <button
                      onClick={generatePDFReport}
                      disabled={loading}
                      className="group gap-2 relative w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 focus:outline-none  disabled:bg-pink-400"
                    >
                      {loading ? "Generating..." : "Generate PDF Report"}
                      {loading && <Loader />}
                    </button>
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
