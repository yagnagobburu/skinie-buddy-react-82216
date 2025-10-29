import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Navigation from "@/components/Navigation";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Products = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("skincare_products");
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: "Gentle Foam Cleanser", brand: "CeraVe", type: "Cleanser", compatibility: "good" as const },
      { id: 2, name: "Niacinamide Serum", brand: "The Ordinary", type: "Serum", compatibility: "good" as const },
      { id: 3, name: "Hyaluronic Acid", brand: "The Ordinary", type: "Hydrator", compatibility: "good" as const },
      { id: 4, name: "Retinol 0.5%", brand: "The Ordinary", type: "Treatment", compatibility: "warning" as const },
      { id: 5, name: "Daily Moisturizer SPF 30", brand: "CeraVe", type: "Moisturizer", compatibility: "good" as const },
    ];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", brand: "", type: "" });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.type) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      brand: newProduct.brand,
      type: newProduct.type,
      compatibility: "good" as const
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem("skincare_products", JSON.stringify(updatedProducts));
    setNewProduct({ name: "", brand: "", type: "" });
    setDialogOpen(false);
    toast.success("Product added successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 pt-16">
      <TopNav />
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Product Bag</h1>
          <p className="text-muted-foreground">Manage your skincare collection</p>
        </div>

        {/* Search and Add */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-card border-border"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Gentle Cleanser"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="e.g., CeraVe"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    placeholder="e.g., Cleanser"
                  />
                </div>
                <Button onClick={handleAddProduct} className="w-full">
                  Add Product
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              brand={product.brand}
              type={product.type}
              compatibility={product.compatibility}
              onRemove={() => console.log("Remove product", product.id)}
            />
          ))}
        </div>
      </div>

      <FloatingChatWidget />
      <Navigation />
    </div>
  );
};

export default Products;
