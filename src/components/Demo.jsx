
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