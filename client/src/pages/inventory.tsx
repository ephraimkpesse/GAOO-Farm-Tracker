import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInventoryItemSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Package, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const formSchema = insertInventoryItemSchema.extend({
  quantity: z.string().min(1, "Quantity is required").transform(val => val.toString()),
  value: z.string().optional().transform(val => val ? val.toString() : undefined),
});

type FormData = z.infer<typeof formSchema>;

export default function Inventory() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const { data: inventory = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/inventory'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: '',
      value: '',
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/inventory', {
        ...data,
        quantity: parseFloat(data.quantity).toString(),
        value: data.value ? parseFloat(data.value).toString() : undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
      form.reset();
      setShowAddForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add inventory item",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createItemMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      deleteItemMutation.mutate(id);
    }
  };

  const totalInventoryValue = inventory.reduce((sum: number, item: any) => {
    return sum + (item.value ? parseFloat(item.value) : 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <>
      <Header 
        title="Inventory" 
        subtitle="Track your farm's inventory and supplies"
        onAddTransaction={() => setShowAddForm(true)}
        showAddButton={true}
      />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Summary Card */}
        <Card className="border border-slate-200 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{inventory.length}</h3>
                <p className="text-slate-600 text-sm">Total Items</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  {formatCurrency(totalInventoryValue)}
                </h3>
                <p className="text-slate-600 text-sm">Total Value</p>
              </div>
              <div className="text-center">
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="farm-green"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">No inventory items</h3>
              <p className="text-slate-600 mb-4">Start tracking your farm's inventory and supplies</p>
              <Button onClick={() => setShowAddForm(true)} className="farm-green">
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          ) : (
            inventory.map((item: any) => (
              <Card key={item.id} className="border border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Package className="text-amber-600 h-6 w-6" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-medium text-slate-800">
                        {parseFloat(item.quantity)} {item.unit}
                      </span>
                    </div>
                    
                    {item.value && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Value:</span>
                        <span className="font-medium text-slate-800">
                          {formatCurrency(parseFloat(item.value))}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Updated:</span>
                      <span className="text-slate-500 text-xs">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Add Item Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Corn Seed, Fertilizer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="kg, tons, bags" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="pl-8"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 farm-green"
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? "Adding..." : "Add Item"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
