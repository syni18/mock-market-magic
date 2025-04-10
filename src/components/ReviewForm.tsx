
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
  initialRating?: number;
  initialComment?: string;
  title?: string;
  productName?: string;
}

export function ReviewForm({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 0,
  initialComment = '',
  title = 'Write a Review',
  productName,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [isOpen, initialRating, initialComment]);

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

    onSubmit({ rating, comment });
    onClose();
    
    if (!isMobile) {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    }
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
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose} className="dark:border-slate-700 dark:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="dark:text-white">
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
