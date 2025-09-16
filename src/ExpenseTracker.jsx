import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ExpenseTracker = () => {
  // State for transactions
  const [transactions, setTransactions] = useState([]);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  // Available categories
  const expenseCategories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other'];
  const incomeCategories = ['Salary', 'Gifts', 'Freelance', 'Investment', 'Other'];

  // Calculate totals
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  // Prepare data for category breakdown chart
  const categoryData = expenseCategories.map(cat => {
    const amount = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { name: cat, value: amount };
  }).filter(item => item.value > 0);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B'];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || !category) return;
    
    const transaction = {
      id: editingId || Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      notes
    };
    
    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? transaction : t));
      setEditingId(null);
    } else {
      setTransactions([...transactions, transaction]);
    }
    
    // Reset form
    setAmount('');
    setCategory('');
    setNotes('');
  };

  // Handle deleting a transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Handle editing a transaction
  const handleEdit = (transaction) => {
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category);
    setNotes(transaction.notes);
    setEditingId(transaction.id);
  };

  // Format currency in Indian Rupees
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};


  // Add in ExpenseTracker component:
React.useEffect(() => {
  const saved = JSON.parse(localStorage.getItem('transactions') || '[]');
  setTransactions(saved);
}, []);

React.useEffect(() => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}, [transactions]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-500">Track your income and expenses</p>
        </header>
        
        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Income</h2>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Total Expenses</h2>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Balance</h2>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form and Chart */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Transaction Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-1">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <p className="text-gray-500 mb-4">{editingId ? 'Update your transaction details' : 'Add a new income or expense'}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="" disabled>Select category</option>
                    {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    id="notes"
                    placeholder="Add any notes about this transaction"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    rows={3}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                  {editingId ? 'Update Transaction' : 'Add Transaction'}
                </button>
                
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setAmount('');
                      setCategory('');
                      setNotes('');
                    }}
                    className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
            
            {/* Category Breakdown Chart */}
            {categoryData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-1">Expense Categories</h3>
                <p className="text-gray-500 mb-4">Breakdown of your spending by category</p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-1">Transactions</h3>
              <p className="text-gray-500 mb-4">Your recent income and expenses</p>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <img 
                    src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9d3b69f3-740b-4a24-9c2d-711af133b8c9.png" 
                    alt="No transactions yet illustration showing an empty wallet and receipt book on a desk" 
                    className="mx-auto mb-4 rounded-lg max-w-xs"
                  />
                  <p>No transactions yet. Add your first transaction above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {transaction.type === 'expense' ? '➖ ' : '➕ '}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </div>
                          {transaction.notes && (
                            <div className="text-sm mt-1">{transaction.notes}</div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;