
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
}

interface PendingReview {
  id: number;
  name: string;
  image: string;
  purchaseDate: string;
}

export function ReviewsRatingTab() {
  const navigate = useNavigate();
  
  // Sample data for reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      productId: 101,
      productName: 'Wireless Headphones',
      productImage: 'https://via.placeholder.com/150',
      rating: 4,
      comment: 'Great sound quality and comfortable to wear for long periods.',
      date: '2023-08-15'
    },
    {
      id: '2',
      productId: 102,
      productName: 'Smart Watch',
      productImage: 'https://via.placeholder.com/150',
      rating: 5,
      comment: 'Amazing battery life and all the features I needed!',
      date: '2023-09-22'
    }
  ]);

  // Products that need reviews
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([
    {
      id: 103,
      name: 'Bluetooth Speaker',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-10-05'
    },
    {
      id: 104,
      name: 'Laptop Stand',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-10-12'
    },
    {
      id: 105,
      name: 'Ergonomic Mouse',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-11-03'
    }
  ]);

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const handleEditReview = (productId: number) => {
    // In a real app, this would navigate to a review form
    navigate(`/products/${productId}`);
  };

  const handleAddReview = (productId: number) => {
    // In a real app, this would navigate to a review form
    navigate(`/products/${productId}`);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <MessageSquare className="mr-2 text-indigo-600" />
          My Reviews
        </h2>
        
        {reviews.length === 0 ? (
          <Card className="bg-white shadow-sm border-slate-100 p-8 text-center">
            <div className="text-center py-8">
              <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-6">You haven't written any reviews yet.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="bg-white shadow-sm border-slate-100 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div 
                      className="w-full md:w-24 h-24 mb-4 md:mb-0 cursor-pointer"
                      onClick={() => navigate(`/products/${review.productId}`)}
                    >
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="md:ml-6 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 
                          className="font-semibold text-lg hover:text-indigo-600 cursor-pointer"
                          onClick={() => navigate(`/products/${review.productId}`)}
                        >
                          {review.productName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-3 bg-gray-50 flex justify-end gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-slate-700"
                    onClick={() => handleEditReview(review.productId)}
                  >
                    Edit Review
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {pendingReviews.length > 0 && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4 flex items-center">
            <ShoppingBag className="mr-2 text-indigo-600" />
            Products to Review
          </h2>
          
          <div className="space-y-3">
            {pendingReviews.map(product => (
              <Card key={product.id} className="bg-white shadow-sm border-slate-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-sm md:text-base hover:text-indigo-600 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        Purchased on {formatDate(product.purchaseDate)}
                      </p>
                      <Button 
                        className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm"
                        onClick={() => handleAddReview(product.id)}
                        size="sm"
                      >
                        <Star className="mr-2 h-3 w-3" />
                        Write a Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
