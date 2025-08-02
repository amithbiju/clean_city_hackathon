import React, { useState } from 'react';
import { Gift, Star, ShoppingBag, Coffee, Award, CheckCircle } from 'lucide-react';
import { mockPartnerStores, mockPointTransactions } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const RewardsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const categories = ['all', 'Grocery', 'Food & Beverage'];

  const filteredStores = selectedCategory === 'all' 
    ? mockPartnerStores 
    : mockPartnerStores.filter(store => store.category === selectedCategory);

  const handleRedeem = (offer: any) => {
    if (!user || user.greenPoints < offer.pointsRequired) return;
    
    setSelectedOffer(offer);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!user || !selectedOffer) return;

    updateUser({ greenPoints: user.greenPoints - selectedOffer.pointsRequired });
    setShowRedeemModal(false);
    setSelectedOffer(null);
    
    // Show success message
    alert(`Successfully redeemed ${selectedOffer.title}! Check your email for the voucher code.`);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Grocery': return <ShoppingBag className="h-5 w-5" />;
      case 'Food & Beverage': return <Coffee className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Green Rewards</h1>
        <p className="text-gray-600">Redeem your Green Points for amazing rewards from our partners</p>
        
        {user && (
          <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="h-6 w-6" />
              <span className="text-xl font-semibold">Your Green Points</span>
            </div>
            <div className="text-4xl font-bold">{user.greenPoints}</div>
            <div className="text-green-100 text-sm mt-1">Keep earning to unlock more rewards!</div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Stores */}
      <div className="space-y-8">
        {filteredStores.map(store => (
          <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{store.logo}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{store.name}</h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    {getIcon(store.category)}
                    <span>{store.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.offers.map(offer => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                    
                    <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-gray-900">{offer.pointsRequired} GP</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRedeem(offer)}
                      disabled={!user || user.greenPoints < offer.pointsRequired}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        user && user.greenPoints >= offer.pointsRequired
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {!user 
                        ? 'Login to Redeem'
                        : user.greenPoints >= offer.pointsRequired
                        ? 'Redeem Now'
                        : `Need ${offer.pointsRequired - user.greenPoints} more GP`
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      {user && mockPointTransactions.filter(t => t.userId === user.id).length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {mockPointTransactions
              .filter(t => t.userId === user.id)
              .slice(0, 5)
              .map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'earned' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'earned' ? <Award className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString()}
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
      )}

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Confirm Redemption</h3>
            </div>
            
            <div className="mb-6">
              <img
                src={selectedOffer.image}
                alt={selectedOffer.title}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h4 className="font-medium text-lg">{selectedOffer.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{selectedOffer.description}</p>
              <p className="font-medium">Cost: {selectedOffer.pointsRequired} Green Points</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Current Points:</span>
                <span className="font-medium">{user?.greenPoints} GP</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>After Redemption:</span>
                <span className="font-medium">{(user?.greenPoints || 0) - selectedOffer.pointsRequired} GP</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage;