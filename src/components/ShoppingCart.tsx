import { useState } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function ShoppingCart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Button onClick={handleContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile heading with clear button */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Shopping Cart</h1>
          <Button 
            variant="outline" 
            onClick={clearCart} 
            size="sm" 
            className="text-xs flex items-center dark:border-gray-600 dark:text-gray-200"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {isMobile ? (
        // Mobile view - card layout
        <div className="space-y-4">
          {items.map((item) => (
            <MobileCartItem 
              key={item.product.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
        // Desktop view - table layout
        <div className="border rounded-md overflow-hidden dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  navigate={navigate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Only show clear cart button on desktop */}
        {!isMobile && (
          <Button 
            variant="outline" 
            onClick={clearCart} 
            size="default" 
            className="text-sm flex items-center dark:border-gray-600 dark:text-gray-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}

        <div className="text-right">
          <div className="text-base md:text-lg font-medium dark:text-white">
            Subtotal: <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Shipping calculated at checkout</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link to="/checkout">
          <Button size={isMobile ? "default" : "lg"} className="px-4 md:px-8 text-sm md:text-base">
            Proceed to Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  navigate: any;
}

function CartItemRow({ item, updateQuantity, removeFromCart, navigate }: CartItemRowProps) {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
            <img 
              className="h-full w-full object-cover rounded" 
              src={product.image} 
              alt={product.name} 
            />
          </div>
          <div className="ml-4">
            <div 
              className="font-medium text-gray-900 dark:text-white cursor-pointer hover:text-ecommerce-600 dark:hover:text-ecommerce-400"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {product.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)} 
            className="text-gray-400 hover:text-ecommerce-600 dark:hover:text-ecommerce-400"
            disabled={quantity <= 1}
          >
            <MinusCircle size={16} />
          </button>
          <span className="mx-2 w-8 text-center dark:text-white">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)} 
            className="text-gray-400 hover:text-ecommerce-600 dark:hover:text-ecommerce-400"
            disabled={quantity >= product.stock}
          >
            <PlusCircle size={16} />
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-900 font-medium dark:text-white">
          ₹{(product.price * quantity).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}

// Mobile cart item component
function MobileCartItem({ item, updateQuantity, removeFromCart, navigate }: CartItemRowProps) {
  const { product, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        {/* Product Image */}
        <div className="flex-shrink-0 w-16 h-16 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
          <img 
            className="h-full w-full object-cover rounded" 
            src={product.image} 
            alt={product.name} 
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-ecommerce-600 dark:hover:text-ecommerce-400 truncate"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">₹{product.price.toFixed(2)}</p>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {/* Quantity Controls */}
        <div className="flex items-center border rounded-md dark:border-gray-600">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)} 
            className="px-2 py-1 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            disabled={quantity <= 1}
          >
            <MinusCircle size={14} />
          </button>
          <span className="px-2 text-sm dark:text-white">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)} 
            className="px-2 py-1 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            disabled={quantity >= product.stock}
          >
            <PlusCircle size={14} />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-sm font-medium dark:text-white">
          Total: <span className="font-bold">₹{(product.price * quantity).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}