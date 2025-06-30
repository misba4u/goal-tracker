import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Target, Clock, CheckCircle, Circle, Edit3, Trash2, Download, Upload, BarChart3, Users, Briefcase, Heart, BookOpen, Settings, ArrowUp, ArrowDown, Link, FileText, TrendingUp, Award, AlertCircle } from 'lucide-react';

const GoalManagementSystem = () => {
  const [goals, setGoals] = useState([]);
  const [activeView, setActiveView] = useState('daily');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('weekly');

  // Goal categories with icons
  const categories = {
    personal: { icon: Heart, color: 'bg-pink-100 text-pink-600', label: 'Personal' },
    professional: { icon: Briefcase, color: 'bg-blue-100 text-blue-600', label: 'Professional' },
    health: { icon: Target, color: 'bg-green-100 text-green-600', label: 'Health' },
    learning: { icon: BookOpen, color: 'bg-purple-100 text-purple-600', label: 'Learning' }
  };

  // Time periods
  const timePeriods = {
    daily: { label: 'Daily', color: 'bg-orange-500' },
    weekly: { label: 'Weekly', color: 'bg-blue-500' },
    monthly: { label: 'Monthly', color: 'bg-green-500' },
    quarterly: { label: 'Quarterly', color: 'bg-purple-500' },
    yearly: { label: 'Yearly', color: 'bg-red-500' }
  };

  // Sample goals for demonstration
  useEffect(() => {
    const sampleGoals = [
      {
        id: 1,
        title: 'Complete morning workout',
        category: 'health',
        period: 'daily',
        progress: 75,
        status: 'in-progress',
        deadline: '2025-06-29',
        notes: 'Been consistent this week',
        parentGoalId: 2,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Exercise 5 times this week',
        category: 'health',
        period: 'weekly',
        progress: 60,
        status: 'in-progress',
        deadline: '2025-07-05',
        notes: 'Building consistency',
        parentGoalId: 4,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Learn React fundamentals',
        category: 'learning',
        period: 'weekly',
        progress: 40,
        status: 'in-progress',
        deadline: '2025-07-05',
        notes: 'Making good progress on components',
        parentGoalId: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Get in best shape of my life',
        category: 'health',
        period: 'yearly',
        progress: 25,
        status: 'in-progress',
        deadline: '2025-12-31',
        notes: 'Long-term fitness transformation',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Master React development',
        category: 'learning',
        period: 'quarterly',
        progress: 30,
        status: 'in-progress',
        deadline: '2025-09-30',
        notes: 'Comprehensive React learning path',
        createdAt: new Date().toISOString()
      }
    ];
    setGoals(sampleGoals);
  }, []);

  const handleAddGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      progress: 0,
      status: 'not-started',
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setShowAddModal(false);
  };

  const handleUpdateGoal = (goalId, updates) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getFilteredGoals = () => {
    return goals.filter(goal => goal.period === activeView);
  };

  const getParentGoals = () => {
    const currentPeriodIndex = Object.keys(timePeriods).indexOf(activeView);
    const longerPeriods = Object.keys(timePeriods).slice(currentPeriodIndex + 1);
    return goals.filter(goal => longerPeriods.includes(goal.period));
  };

  const getChildGoals = (parentId) => {
    return goals.filter(goal => goal.parentGoalId === parentId);
  };

  const getParentGoal = (parentId) => {
    return goals.find(goal => goal.id === parentId);
  };

  // Report generation functions
  const generateReport = (period) => {
    const filteredGoals = goals.filter(goal => goal.period === period);
    const completedGoals = filteredGoals.filter(goal => goal.status === 'completed');
    const inProgressGoals = filteredGoals.filter(goal => goal.status === 'in-progress');
    const notStartedGoals = filteredGoals.filter(goal => goal.status === 'not-started');
    
    const totalProgress = filteredGoals.reduce((sum, goal) => sum + goal.progress, 0);
    const averageProgress = filteredGoals.length > 0 ? Math.round(totalProgress / filteredGoals.length) : 0;
    
    // Category breakdown
    const categoryStats = Object.keys(categories).map(category => {
      const categoryGoals = filteredGoals.filter(goal => goal.category === category);
      const categoryProgress = categoryGoals.reduce((sum, goal) => sum + goal.progress, 0);
      const categoryAverage = categoryGoals.length > 0 ? Math.round(categoryProgress / categoryGoals.length) : 0;
      
      return {
        category,
        count: categoryGoals.length,
        completed: categoryGoals.filter(goal => goal.status === 'completed').length,
        averageProgress: categoryAverage,
        goals: categoryGoals
      };
    }).filter(stat => stat.count > 0);

    // Goal hierarchy insights
    const hierarchyInsights = {
      parentGoals: filteredGoals.filter(goal => !goal.parentGoalId),
      childGoals: filteredGoals.filter(goal => goal.parentGoalId),
      orphanGoals: filteredGoals.filter(goal => !goal.parentGoalId && getChildGoals(goal.id).length === 0)
    };

    // Deadlines and overdue goals
    const now = new Date();
    const overdueGoals = filteredGoals.filter(goal => 
      new Date(goal.deadline) < now && goal.status !== 'completed'
    );
    const upcomingDeadlines = filteredGoals.filter(goal => {
      const deadline = new Date(goal.deadline);
      const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 7 && daysUntilDeadline >= 0 && goal.status !== 'completed';
    });

    return {
      period,
      totalGoals: filteredGoals.length,
      completedGoals: completedGoals.length,
      inProgressGoals: inProgressGoals.length,
      notStartedGoals: notStartedGoals.length,
      averageProgress,
      categoryStats,
      hierarchyInsights,
      overdueGoals,
      upcomingDeadlines,
      completionRate: filteredGoals.length > 0 ? Math.round((completedGoals.length / filteredGoals.length) * 100) : 0,
      topPerformingCategory: categoryStats.length > 0 ? categoryStats.reduce((prev, current) => 
        prev.averageProgress > current.averageProgress ? prev : current
      ) : null
    };
  };

  const exportReport = (reportData) => {
    const reportText = `
Goal Management Report - ${reportData.period.toUpperCase()}
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
========
Total Goals: ${reportData.totalGoals}
Completed: ${reportData.completedGoals} (${reportData.completionRate}%)
In Progress: ${reportData.inProgressGoals}
Not Started: ${reportData.notStartedGoals}
Average Progress: ${reportData.averageProgress}%

CATEGORY BREAKDOWN
==================
${reportData.categoryStats.map(stat => `
${categories[stat.category].label}:
  - Goals: ${stat.count}
  - Completed: ${stat.completed}
  - Average Progress: ${stat.averageProgress}%
`).join('')}

ALERTS
======
Overdue Goals: ${reportData.overdueGoals.length}
${reportData.overdueGoals.map(goal => `- ${goal.title} (Due: ${new Date(goal.deadline).toLocaleDateString()})`).join('\n')}

Upcoming Deadlines: ${reportData.upcomingDeadlines.length}
${reportData.upcomingDeadlines.map(goal => `- ${goal.title} (Due: ${new Date(goal.deadline).toLocaleDateString()})`).join('\n')}

RECOMMENDATIONS
===============
${reportData.topPerformingCategory ? `Top performing category: ${categories[reportData.topPerformingCategory.category].label}` : 'No data available'}
${reportData.hierarchyInsights.orphanGoals.length > 0 ? `Consider linking ${reportData.hierarchyInsights.orphanGoals.length} standalone goals to longer-term objectives` : ''}
${reportData.overdueGoals.length > 0 ? 'Focus on completing overdue goals to maintain momentum' : ''}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goal-report-${reportData.period}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const connectToGoogle = () => {
    // Simulate Google OAuth connection
    setIsGoogleConnected(true);
    alert('Google integration connected! (Demo mode)');
  };

  const syncToGoogleCalendar = (goal) => {
    if (!isGoogleConnected) {
      alert('Please connect to Google first');
      return;
    }
    alert(`Syncing "${goal.title}" to Google Calendar! (Demo mode)`);
  };

  const exportToGoogleDrive = () => {
    if (!isGoogleConnected) {
      alert('Please connect to Google first');
      return;
    }
    const data = JSON.stringify(goals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goals-backup.json';
    a.click();
    alert('Goals exported to Google Drive! (Demo mode)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Goal Tracker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowReports(!showReports)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                  showReports 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Reports</span>
              </button>
              <button 
                onClick={connectToGoogle}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isGoogleConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isGoogleConnected ? '✓ Google Connected' : 'Connect Google'}
              </button>
              <button 
                onClick={exportToGoogleDrive}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Export to Google Drive"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showReports ? (
          <ReportsView 
            goals={goals}
            categories={categories}
            timePeriods={timePeriods}
            generateReport={generateReport}
            exportReport={exportReport}
            reportPeriod={reportPeriod}
            setReportPeriod={setReportPeriod}
            onBack={() => setShowReports(false)}
          />
        ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Time Period Selector */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Periods</h3>
              <div className="space-y-2">
                {Object.entries(timePeriods).map(([key, period]) => (
                  <button
                    key={key}
                    onClick={() => setActiveView(key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === key 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{period.label}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {goals.filter(g => g.period === key).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Goals</span>
                  <span className="font-semibold">{goals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">
                    {goals.filter(g => g.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-semibold text-blue-600">
                    {goals.filter(g => g.status === 'in-progress').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeView} Goals
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Goal</span>
              </button>
            </div>

            {/* Goals Grid */}
            <div className="space-y-6">
              {getFilteredGoals().map(goal => {
                const CategoryIcon = categories[goal.category].icon;
                const parentGoal = goal.parentGoalId ? getParentGoal(goal.parentGoalId) : null;
                const childGoals = getChildGoals(goal.id);
                
                return (
                  <div key={goal.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Parent Goal Link */}
                    {parentGoal && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-t-lg">
                        <div className="flex items-center space-x-2 text-sm">
                          <ArrowUp className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">Contributes to:</span>
                          <span className="font-medium text-blue-900">{parentGoal.title}</span>
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                            {parentGoal.period}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${categories[goal.category].color}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => syncToGoogleCalendar(goal)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="Sync to Google Calendar"
                          >
                            <Calendar className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setEditingGoal(goal)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{goal.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{goal.notes}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Deadline */}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-gray-600">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                          goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Child Goals */}
                    {childGoals.length > 0 && (
                      <div className="bg-green-50 border-l-4 border-green-500 px-4 py-3 rounded-b-lg">
                        <div className="flex items-center space-x-2 text-sm mb-2">
                          <ArrowDown className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 font-medium">Supporting goals:</span>
                        </div>
                        <div className="space-y-1">
                          {childGoals.map(child => (
                            <div key={child.id} className="flex items-center justify-between bg-white rounded px-3 py-2">
                              <span className="text-sm text-gray-900">{child.title}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                  {child.period}
                                </span>
                                <span className="text-xs text-gray-600">{child.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {getFilteredGoals().length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeView} goals yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first goal!</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Goal
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      {(showAddModal || editingGoal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            <GoalForm
              goal={editingGoal}
              goals={goals}
              onSubmit={editingGoal ? 
                (data) => {
                  handleUpdateGoal(editingGoal.id, data);
                  setEditingGoal(null);
                } : 
                handleAddGoal
              }
              onCancel={() => {
                setShowAddModal(false);
                setEditingGoal(null);
              }}
              categories={categories}
              timePeriods={timePeriods}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsView = ({ goals, categories, timePeriods, generateReport, exportReport, reportPeriod, setReportPeriod, onBack }) => {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    setReportData(generateReport(reportPeriod));
  }, [reportPeriod, goals, generateReport]);

  if (!reportData) return <div>Loading report...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Goal Reports</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
            <option value="yearly">Annual Report</option>
          </select>
          <button
            onClick={() => exportReport(reportData)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.averageProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.overdueGoals.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goal Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Completed</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${reportData.totalGoals > 0 ? (reportData.inProgressGoals / reportData.totalGoals) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{reportData.inProgressGoals}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Not Started</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{ width: `${reportData.totalGoals > 0 ? (reportData.notStartedGoals / reportData.totalGoals) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{reportData.notStartedGoals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
          <div className="space-y-4">
            {reportData.categoryStats.map(stat => {
              const CategoryIcon = categories[stat.category].icon;
              return (
                <div key={stat.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${categories[stat.category].color}`}>
                      <CategoryIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {categories[stat.category].label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-600">{stat.count} goals</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stat.averageProgress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Goals */}
        {reportData.overdueGoals.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Overdue Goals
            </h3>
            <div className="space-y-2">
              {reportData.overdueGoals.map(goal => (
                <div key={goal.id} className="flex items-center justify-between bg-white rounded p-3">
                  <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                  <span className="text-xs text-red-600">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Deadlines */}
        {reportData.upcomingDeadlines.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Deadlines
            </h3>
            <div className="space-y-2">
              {reportData.upcomingDeadlines.map(goal => (
                <div key={goal.id} className="flex items-center justify-between bg-white rounded p-3">
                  <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                  <span className="text-xs text-yellow-600">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Insights & Recommendations
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          {reportData.topPerformingCategory && (
            <p>🏆 Top performing category: <strong>{categories[reportData.topPerformingCategory.category].label}</strong> ({reportData.topPerformingCategory.averageProgress}% avg progress)</p>
          )}
          {reportData.hierarchyInsights.orphanGoals.length > 0 && (
            <p>🔗 Consider linking {reportData.hierarchyInsights.orphanGoals.length} standalone goals to longer-term objectives for better alignment</p>
          )}
          {reportData.overdueGoals.length > 0 && (
            <p>⚠️ Focus on completing {reportData.overdueGoals.length} overdue goals to maintain momentum</p>
          )}
          {reportData.completionRate >= 80 && (
            <p>🎉 Excellent completion rate! You're building great consistency with your goals</p>
          )}
          {reportData.completionRate < 50 && (
            <p>💡 Consider setting fewer, more focused goals to improve your completion rate</p>
          )}
        </div>
      </div>
    </div>
  );
};

const GoalForm = ({ goal, goals, onSubmit, onCancel, categories, timePeriods }) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    category: goal?.category || 'personal',
    period: goal?.period || 'daily',
    deadline: goal?.deadline || '',
    notes: goal?.notes || '',
    progress: goal?.progress || 0,
    status: goal?.status || 'not-started',
    parentGoalId: goal?.parentGoalId || null
  });

  // Get available parent goals (goals with longer time periods)
  const getAvailableParentGoals = () => {
    const currentPeriodIndex = Object.keys(timePeriods).indexOf(formData.period);
    const longerPeriods = Object.keys(timePeriods).slice(currentPeriodIndex + 1);
    
    return goals.filter(g => 
      longerPeriods.includes(g.period) && 
      g.category === formData.category &&
      g.id !== goal?.id // Don't allow linking to self
    );
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a goal title');
      return;
    }
    if (!formData.deadline) {
      alert('Please set a deadline');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your goal..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <select
            value={formData.period}
            onChange={(e) => setFormData({...formData, period: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(timePeriods).map(([key, period]) => (
              <option key={key} value={key}>{period.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {goal && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add any notes or details..."
        />
      </div>

      {/* Parent Goal Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link to Parent Goal <span className="text-xs text-gray-500">(optional)</span>
        </label>
        <select
          value={formData.parentGoalId || ''}
          onChange={(e) => setFormData({...formData, parentGoalId: e.target.value || null})}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No parent goal</option>
          {getAvailableParentGoals().map(parentGoal => (
            <option key={parentGoal.id} value={parentGoal.id}>
              {parentGoal.title} ({parentGoal.period})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Link this goal to a longer-term goal in the same category
        </p>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          {goal ? 'Update Goal' : 'Add Goal'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GoalManagementSystem; 

