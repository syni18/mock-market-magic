
import { useState } from 'react';
import { useCart, CartItem } from '@/context/CartContext';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function ShoppingCart() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
        
        <div className="text-right">
          <div className="text-lg font-medium">
            Subtotal: <span className="font-bold">${cartTotal.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Shipping calculated at checkout</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Link to="/checkout">
          <Button size="lg" className="px-8">
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
}

function CartItemRow({ item, updateQuantity, removeFromCart }: CartItemRowProps) {
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
          <div className="flex-shrink-0 h-16 w-16">
            <img 
              className="h-full w-full object-cover rounded" 
              src={product.image} 
              alt={product.name} 
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-900">${product.price.toFixed(2)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)} 
            className="text-gray-400 hover:text-ecommerce-600"
            disabled={quantity <= 1}
          >
            <MinusCircle size={16} />
          </button>
          <span className="mx-2 w-8 text-center">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)} 
            className="text-gray-400 hover:text-ecommerce-600"
            disabled={quantity >= product.stock}
          >
            <PlusCircle size={16} />
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-900 font-medium">
          ${(product.price * quantity).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}
