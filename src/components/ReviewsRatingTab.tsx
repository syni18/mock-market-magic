
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ShoppingBag, Edit, Trash2, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ReviewForm } from './ReviewForm';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  productId: number;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface PendingReview {
  id: number;
  name: string;
  image: string;
  purchaseDate: string;
}

// Helper function to retrieve reviews from localStorage
const getStoredReviews = (): Review[] => {
  try {
    const storedReviews = localStorage.getItem('userReviews');
    return storedReviews ? JSON.parse(storedReviews) : [];
  } catch (error) {
    console.error('Failed to parse reviews from localStorage', error);
    return [];
  }
};

// Helper function to save reviews to localStorage
const saveReviewsToStorage = (reviews: Review[]) => {
  try {
    localStorage.setItem('userReviews', JSON.stringify(reviews));
  } catch (error) {
    console.error('Failed to save reviews to localStorage', error);
  }
};

export function ReviewsRatingTab() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // State for reviews with localStorage persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    const storedReviews = getStoredReviews();
    return storedReviews.length > 0 ? storedReviews : [
      {
        id: '1',
        productId: 101,
        productName: 'Wireless Headphones',
        productImage: 'https://via.placeholder.com/150',
        rating: 4,
        comment: 'Great sound quality and comfortable to wear for long periods.',
        date: '2023-08-15',
        images: []
      },
      {
        id: '2',
        productId: 102,
        productName: 'Smart Watch',
        productImage: 'https://via.placeholder.com/150',
        rating: 5,
        comment: 'Amazing battery life and all the features I needed!',
        date: '2023-09-22',
        images: []
      }
    ];
  });

  // Products that need reviews - expanded to have more products for carousel
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
    },
    {
      id: 106,
      name: 'Mechanical Keyboard',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-11-15'
    },
    {
      id: 107,
      name: 'USB-C Hub',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-12-01'
    },
    {
      id: 108,
      name: 'Wireless Charger',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2023-12-10'
    },
    {
      id: 109,
      name: 'Phone Case',
      image: 'https://via.placeholder.com/150',
      purchaseDate: '2024-01-05'
    }
  ]);

  // State for review form
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PendingReview | null>(null);
  
  // State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      const updatedReviews = reviews.filter(review => review.id !== reviewToDelete);
      setReviews(updatedReviews);
      saveReviewsToStorage(updatedReviews);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      
      if (!isMobile) {
        toast({
          title: "Review deleted",
          description: "Your review has been successfully deleted",
        });
      }
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewFormOpen(true);
  };

  const handleAddReview = (product: PendingReview) => {
    setSelectedProduct(product);
    setReviewFormOpen(true);
  };

  const handleReviewSubmit = (reviewData: { rating: number; comment: string; images: string[] }) => {
    if (editingReview) {
      // Update existing review
      const updatedReviews = reviews.map(review => 
        review.id === editingReview.id 
          ? { ...review, rating: reviewData.rating, comment: reviewData.comment, images: reviewData.images }
          : review
      );
      setReviews(updatedReviews);
      saveReviewsToStorage(updatedReviews);
      setEditingReview(null);
    } else if (selectedProduct) {
      // Add new review
      const newReview: Review = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString().split('T')[0],
        images: reviewData.images
      };
      
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      saveReviewsToStorage(updatedReviews);
      
      // Remove from pending reviews
      setPendingReviews(prev => prev.filter(product => product.id !== selectedProduct.id));
      setSelectedProduct(null);
    }
  };

  const closeReviewForm = () => {
    setReviewFormOpen(false);
    setEditingReview(null);
    setSelectedProduct(null);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
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
        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center dark:text-white">
          <MessageSquare className="mr-2 text-indigo-600 dark:text-indigo-400" />
          My Reviews
        </h2>
        
        {reviews.length === 0 ? (
          <Card className="bg-white shadow-sm border-slate-100 p-8 text-center dark:bg-slate-800 dark:border-slate-700">
            <div className="text-center py-8">
              <div className="inline-flex justify-center items-center p-4 bg-indigo-50 rounded-full mb-6 dark:bg-indigo-900">
                <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">No reviews yet</h3>
              <p className="text-gray-500 mb-6 dark:text-gray-400">You haven't written any reviews yet.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="bg-white shadow-sm border-slate-100 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
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
                          className="font-semibold text-lg hover:text-indigo-600 cursor-pointer dark:text-white dark:hover:text-indigo-400"
                          onClick={() => navigate(`/products/${review.productId}`)}
                        >
                          {review.productName}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                      
                      {/* Review images */}
                      {review.images && review.images.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                              <div 
                                key={index} 
                                className="w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700"
                              >
                                <img 
                                  src={image} 
                                  alt={`Review image ${index + 1}`} 
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => window.open(image, '_blank')}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-3 bg-gray-50 flex justify-end gap-2 dark:bg-slate-900 dark:border-t dark:border-slate-700">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                    onClick={() => handleEditReview(review)}
                  >
                    <Edit className="h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400" />
                    Edit Review
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30 dark:text-red-400"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
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
          <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4 flex items-center dark:text-white">
            <ShoppingBag className="mr-2 text-indigo-600 dark:text-indigo-400" />
            Products to Review
          </h2>
          
          {/* Responsive design for product cards */}
          {isMobile ? (
            <div className="space-y-3">
              {pendingReviews.map(product => (
                <Card key={product.id} className="bg-white shadow-sm border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover rounded-md"
                          onClick={() => navigate(`/products/${product.id}`)}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-sm md:text-base hover:text-indigo-600 cursor-pointer truncate dark:text-white dark:hover:text-indigo-400"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                          Purchased on {formatDate(product.purchaseDate)}
                        </p>
                        <Button 
                          className="bg-indigo-600 hover:bg-indigo-700 text-xs w-full dark:bg-indigo-700 dark:hover:bg-indigo-600"
                          onClick={() => handleAddReview(product)}
                          size="sm"
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Write a Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {pendingReviews.map(product => (
                  <CarouselItem key={product.id} className="pl-4 basis-1/5">
                    <Card className="bg-white shadow-sm border-slate-100 h-full dark:bg-slate-800 dark:border-slate-700">
                      <CardContent className="p-4 flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-cover rounded-md cursor-pointer"
                            onClick={() => navigate(`/products/${product.id}`)}
                          />
                        </div>
                        <div className="text-center">
                          <h3 
                            className="font-semibold text-sm hover:text-indigo-600 cursor-pointer mb-1 dark:text-white dark:hover:text-indigo-400"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 dark:text-gray-400">
                            {formatDate(product.purchaseDate)}
                          </p>
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 text-xs w-full dark:bg-indigo-700 dark:hover:bg-indigo-600"
                            onClick={() => handleAddReview(product)}
                            size="sm"
                          >
                            <Star className="mr-1 h-3 w-3" />
                            Write a Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </div>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        isOpen={reviewFormOpen}
        onClose={closeReviewForm}
        onSubmit={handleReviewSubmit}
        initialRating={editingReview?.rating || 0}
        initialComment={editingReview?.comment || ''}
        initialImages={editingReview?.images || []}
        title={editingReview ? "Edit Review" : "Write a Review"}
        productName={editingReview?.productName || selectedProduct?.name}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteReview}
              className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
