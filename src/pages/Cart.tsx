
import { ShoppingCart } from '@/components/ShoppingCart';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Cart = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          <ShoppingCart />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
