
import { useState, useEffect } from 'react';
import { Star, X, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string; images: string[] }) => void;
  initialRating?: number;
  initialComment?: string;
  initialImages?: string[];
  title?: string;
  productName?: string;
}

export function ReviewForm({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = '',
  initialImages = [],
  title = 'Write a Review',
  productName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [images, setImages] = useState<string[]>(initialImages);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
      setImages(initialImages || []);
    }
  }, [isOpen, initialRating, initialComment, initialImages]);

  const handleSubmit = () => {
    if (rating === 0) {
      if (!isMobile) {
        toast({
          title: "Rating required",
          description: "Please select a star rating before submitting your review",
          variant: "destructive",
        });
      }
      return;
    }

    if (comment.trim() === '') {
      if (!isMobile) {
        toast({
          title: "Review required",
          description: "Please write a review comment before submitting",
          variant: "destructive",
        });
      }
      return;
    }

    onSubmit({ rating, comment, images });
    onClose();
    
    if (!isMobile) {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit the number of images to 5
      if (images.length + fileArray.length > 5) {
        if (!isMobile) {
          toast({
            title: "Too many images",
            description: "You can upload a maximum of 5 images",
            variant: "destructive",
          });
        }
        return;
      }
      
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result) {
            setImages(prev => [...prev, loadEvent.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => {
        const ratingValue = i + 1;
        return (
          <Star
            key={i}
            className={`h-8 w-8 cursor-pointer transition-colors ${
              (hoveredRating || rating) >= ratingValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
            onMouseEnter={() => setHoveredRating(ratingValue)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(ratingValue)}
          />
        );
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md dark:bg-slate-800 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{title}</DialogTitle>
          {productName && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              for {productName}
            </p>
          )}
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium dark:text-white">Rating</label>
            <div className="flex items-center space-x-1">{renderStars()}</div>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="review" className="text-sm font-medium dark:text-white">
              Your Review
            </label>
            <Textarea
              id="review"
              className="min-h-[120px] dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">
              Add Images (Optional)
            </label>
            
            {/* Image previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 my-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative w-16 h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <img 
                      src={image} 
                      alt={`Review image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/3 -translate-y-1/3"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Image upload button */}
            {images.length < 5 && (
              <div className="mt-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
                    <ImagePlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Upload Images
                    </span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  You can upload up to 5 images
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose} className="dark:border-slate-700 dark:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:text-white">
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
