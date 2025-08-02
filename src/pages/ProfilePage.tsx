import React, { useState } from 'react';
import { User, Award, Camera, Mail, Calendar, Trophy, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockPointTransactions } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) return null;

  const userTransactions = mockPointTransactions.filter(t => t.userId === user.id);
  const totalEarned = userTransactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0);
  const totalRedeemed = userTransactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + Math.abs(t.points), 0);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const achievements = [
    { id: 1, title: 'First Report', description: 'Submitted your first waste report', earned: true, icon: '🎯' },
    { id: 2, title: 'Community Helper', description: 'Joined a cleanup drive', earned: true, icon: '🤝' },
    { id: 3, title: 'Green Warrior', description: 'Earned 500+ Green Points', earned: user.greenPoints >= 500, icon: '⚡' },
    { id: 4, title: 'Eco Champion', description: 'Cleaned 10+ waste areas', earned: false, icon: '🏆' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{user.greenPoints}</div>
              <div className="text-green-100">Green Points</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-8 border-b">
          <h2 className="text-xl font-semibold mb-6">Your Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{totalEarned}</div>
              <div className="text-green-600">Points Earned</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{totalRedeemed}</div>
              <div className="text-blue-600">Points Redeemed</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{achievements.filter(a => a.earned).length}</div>
              <div className="text-purple-600">Achievements</div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-8 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{user.name}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{user.email}</div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="p-8 border-b">
          <h2 className="text-xl font-semibold mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.earned ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {userTransactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'earned' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {transaction.type === 'earned' ? <Award className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()} at{' '}
                      {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'earned' ? '+' : ''}{transaction.points} GP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;