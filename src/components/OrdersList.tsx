
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, ChevronDown, ChevronUp, Calendar, Truck, CheckCircle, 
  Clock, Filter, Search
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

// Mock order data
const orders = [
  {
    id: '#ORD-2023-1201',
    date: 'Dec 1, 2023',
    status: 'Delivered',
    total: 124.99,
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 89.99, image: 'https://via.placeholder.com/60' },
      { name: 'USB Cable', quantity: 1, price: 12.99, image: 'https://via.placeholder.com/60' },
      { name: 'Phone Case', quantity: 1, price: 22.01, image: 'https://via.placeholder.com/60' },
    ]
  },
  {
    id: '#ORD-2023-0987',
    date: 'Nov 15, 2023',
    status: 'Processing',
    total: 239.98,
    items: [
      { name: 'Smart Watch', quantity: 1, price: 199.99, image: 'https://via.placeholder.com/60' },
      { name: 'Watch Band', quantity: 1, price: 39.99, image: 'https://via.placeholder.com/60' },
    ]
  },
  {
    id: '#ORD-2023-0875',
    date: 'Oct 28, 2023',
    status: 'Delivered',
    total: 459.95,
    items: [
      { name: 'Tablet Pro', quantity: 1, price: 399.99, image: 'https://via.placeholder.com/60' },
      { name: 'Screen Protector', quantity: 1, price: 29.99, image: 'https://via.placeholder.com/60' },
      { name: 'Tablet Case', quantity: 1, price: 29.97, image: 'https://via.placeholder.com/60' },
    ]
  },
];

export const OrdersList = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apply filters to orders
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filterStatus && order.status !== filterStatus) return false;
    
    // Filter by search term
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Processing':
        return <Clock className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
          <Package className="mr-2 text-indigo-600" /> Your Orders
        </h2>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-auto">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-sm"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-1 items-center text-sm">
                <Filter className="h-4 w-4" />
                {filterStatus || "All"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus(null)} className="text-sm">
                All Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus('Delivered')} className="text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Processing')} className="text-sm">
                <Clock className="h-4 w-4 mr-2 text-blue-600" /> Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Shipped')} className="text-sm">
                <Truck className="h-4 w-4 mr-2 text-purple-600" /> Shipped
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="py-12 flex flex-col items-center">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-slate-800">No Orders Found</h3>
            <p className="text-slate-600 mb-6 text-center">
              {searchTerm || filterStatus 
                ? "Try adjusting your search or filter criteria" 
                : "Looks like you haven't placed any orders yet."}
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Start Shopping</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card 
              key={order.id}
              className="bg-white shadow-sm border-slate-100 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <span className="text-base md:text-lg font-medium text-slate-800">{order.id}</span>
                    <div className="flex items-center text-slate-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-xs md:text-sm">{order.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    <span className="font-medium text-slate-800 text-sm md:text-base">${order.total.toFixed(2)}</span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <ul className="divide-y divide-slate-200">
                    {order.items.map((item, index) => (
                      <li key={index} className="py-3 flex items-center">
                        <div className="h-12 w-12 rounded overflow-hidden border border-slate-200 bg-white">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <p className={isMobile ? "text-xs md:text-sm font-medium" : "text-sm md:text-base font-medium"}>
                            {item.name}
                          </p>
                          <p className="text-xs md:text-sm text-slate-500">
                            Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-sm md:text-base">₹{(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
                    <Button 
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs md:text-sm"
                    >
                      Track Order
                    </Button>
                    
                    <div className="text-right">
                      <div className="flex justify-between md:justify-end md:gap-8 text-xs md:text-sm text-slate-600">
                        <span>Subtotal:</span>
                        <span>₹{(order.total - 5.99).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between md:justify-end md:gap-8 text-xs md:text-sm text-slate-600">
                        <span>Shipping:</span>
                        <span>₹5.99</span>
                      </div>
                      <div className="flex justify-between md:justify-end md:gap-8 font-medium text-slate-800 text-sm md:text-lg mt-2">
                        <span>Total:</span>
                        <span>₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
