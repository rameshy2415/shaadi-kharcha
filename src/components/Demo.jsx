
// Frontend App.js to set up routes
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { authAPI } from './services/api';

// Private Route component for protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard user={user} />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;

// Example Dashboard component (components/Dashboard.js)
import React, { useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';

const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    category: 'Venue',
    description: '',
    amount: '',
    paidBy: '',
    paymentMethod: 'Cash',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await expenseAPI.getExpenses();
        setExpenses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      let res;
      
      if (editingId) {
        // Update existing expense
        res = await expenseAPI.updateExpense(editingId, formData);
        
        // Update expenses array
        setExpenses(expenses.map(expense => 
          expense._id === editingId ? res.data : expense
        ));
        
        setEditingId(null);
      } else {
        // Add new expense
        res = await expenseAPI.addExpense(formData);
        
        // Add new expense to array
        setExpenses([res.data, ...expenses]);
      }
      
      // Reset form
      setFormData({
        category: 'Venue',
        description: '',
        amount: '',
        paidBy: '',
        paymentMethod: 'Cash',
        notes: ''
      });
    } catch (err) {
      console.error("Failed to save expense", err);
    }
  };

  // Handle expense deletion
  const handleDelete = async (id) => {
    try {
      await expenseAPI.deleteExpense(id);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      console.error("Failed to delete expense", err);
    }
  };

  // Handle editing an expense
  const handleEdit = (expense) => {
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paidBy: expense.paidBy,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || ''
    });
    setEditingId(expense._id);
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="dashboard">
      <header>
        <h1>Wedding Expense Tracker</h1>
        <p>Welcome, {user?.name}!</p>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="expense-form-container">
          <h2>{editingId ? 'Edit Expense' : 'Add New Expense'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                required
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Attire">Attire</option>
                <option value="Photography">Photography</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Paid By</label>
              <input
                type="text"
                name="paidBy"
                value={formData.paidBy}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Payment Method</label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
            
            <button type="submit">
              {editingId ? 'Update Expense' : 'Add Expense'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    category: 'Venue',
                    description: '',
                    amount: '',
                    paidBy: '',
                    paymentMethod: 'Cash',
                    notes: ''
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="expense-list-container">
          <h2>Your Wedding Expenses</h2>
          <div className="expense-summary">
            <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
          </div>
          
          {loading ? (
            <p>Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p>No expenses recorded yet. Add your first expense!</p>
          ) : (
            <div className="expense-list">
              {expenses.map(expense => (
                <div key={expense._id} className="expense-card">
                  <div className="expense-card-header">
                    <h3>{expense.description}</h3>
                    <span className={`category-badge ${expense.category.toLowerCase()}`}>
                      {expense.category}
                    </span>
                  </div>
                  <div className="expense-card-body">
                    <p className="expense-amount">${expense.amount.toFixed(2)}</p>
                    <p>Paid by: {expense.paidBy}</p>
                    <p>Method: {expense.paymentMethod}</p>
                    {expense.notes && <p>Notes: {expense.notes}</p>}
                    <p className="expense-date">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="expense-card-actions">
                    <button onClick={() => handleEdit(expense)}>Edit</button>
                    <button onClick={() => handleDelete(expense._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log('Login attempted', { email, password });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.667a4.333 4.333 0 1 0 0 8.666 4.338 4.338 0 0 0 3.251-1.537l-3.251-2.463h5.545z"/>
                  </svg>
                  Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm.163 18.548c-3.038 0-5.5-2.463-5.5-5.5s2.462-5.5 5.5-5.5c1.481 0 2.811.59 3.807 1.541l-1.6 1.541a3.085 3.085 0 0 0-2.207-.907c-1.897 0-3.444 1.565-3.444 3.425s1.547 3.425 3.444 3.425c1.694 0 2.909-1.212 3.156-2.832h-3.156v-2.017h5.272c.056.282.101.564.101.936 0 3.21-2.151 5.488-5.373 5.488z"/>
                  </svg>
                  Apple
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;







import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data structure to represent complete marriage expenses tracking
const initialData = {
  expenses: [
    { category: 'Venue', subcategory: 'Wedding Hall', amount: 50000, vendor: 'Royal Banquet Hall', date: '2024-02-15' },
    { category: 'Catering', subcategory: 'Main Course', amount: 35000, vendor: 'Gourmet Caterers', date: '2024-02-20' },
    { category: 'Photography', subcategory: 'Wedding Shoot', amount: 25000, vendor: 'Memory Makers Studio', date: '2024-02-10' },
    { category: 'Decorations', subcategory: 'Floral', amount: 15000, vendor: 'Floral Fantasies', date: '2024-02-12' },
    { category: 'Attire', subcategory: 'Bride & Groom', amount: 40000, vendor: 'Bridal Couture', date: '2024-01-25' }
  ],
  receivedMoney: [
    { source: 'Bride\'s Family', amount: 100000, date: '2024-01-20' },
    { source: 'Groom\'s Family', amount: 75000, date: '2024-01-22' },
    { source: 'Friends Contribution', amount: 25000, date: '2024-02-05' }
  ]
};

const MarriageExpensesFullReport = () => {
  const [data, setData] = useState(initialData);

  const generatePDFReport = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Calculate totals
    const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalReceived = data.receivedMoney.reduce((sum, money) => sum + money.amount, 0);
    const netBalance = totalReceived - totalExpenses;

    // Report Title
    doc.setFontSize(22);
    doc.text('Marriage Expenses Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Expenses Section
    doc.setFontSize(16);
    doc.text('Expenses Breakdown', 20, 50);
    doc.autoTable({
      startY: 60,
      head: [['Category', 'Subcategory', 'Vendor', 'Date', 'Amount (₹)']],
      body: data.expenses.map(expense => [
        expense.category,
        expense.subcategory,
        expense.vendor,
        expense.date,
        expense.amount.toLocaleString()
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Received Money Section
    const expensesEndY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text('Received Money', 20, expensesEndY);
    doc.autoTable({
      startY: expensesEndY + 10,
      head: [['Source', 'Date', 'Amount (₹)']],
      body: data.receivedMoney.map(money => [
        money.source,
        money.date,
        money.amount.toLocaleString()
      ]),
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [39, 174, 96] }
    });

    // Summary Section
    const receivedMoneyEndY = doc.previousAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text('Financial Summary', 20, receivedMoneyEndY);
    
    doc.autoTable({
      startY: receivedMoneyEndY + 10,
      head: [['Description', 'Amount (₹)']],
      body: [
        ['Total Expenses', totalExpenses.toLocaleString()],
        ['Total Received', totalReceived.toLocaleString()],
        ['Net Balance', netBalance.toLocaleString()]
      ],
      theme: 'plain',
      styles: { fontSize: 12 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255 }
    });

    // Save the PDF
    doc.save('Marriage_Expenses_Report.pdf');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Marriage Expenses Full Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">Expenses Summary</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Category</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.expenses.map((expense, index) => (
                  <tr key={index}>
                    <td>{expense.category}</td>
                    <td className="text-right">₹{expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="font-bold">Total Expenses</td>
                  <td className="text-right font-bold">
                    ₹{data.expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h3 className="font-bold mb-2">Received Money</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Source</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.receivedMoney.map((money, index) => (
                  <tr key={index}>
                    <td>{money.source}</td>
                    <td className="text-right">₹{money.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="font-bold">Total Received</td>
                  <td className="text-right font-bold">
                    ₹{data.receivedMoney.reduce((sum, money) => sum + money.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex space-x-2">
            <Button onClick={generatePDFReport}>
              Generate Full Report PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarriageExpensesFullReport;