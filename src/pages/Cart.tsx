
import { ShoppingCart } from '@/components/ShoppingCart';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Cart = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          {!isMobile ? (
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Shopping Cart</h1>
          ) : null}
          <ShoppingCart />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
