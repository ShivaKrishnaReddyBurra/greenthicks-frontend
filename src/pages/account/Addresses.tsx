
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Sample addresses
const sampleAddresses = [
  {
    id: "1",
    name: "Home",
    street: "123 Main Street",
    city: "Anytown",
    state: "CA",
    postalCode: "12345",
    country: "United States",
    isDefault: true,
  },
  {
    id: "2",
    name: "Work",
    street: "456 Office Park",
    city: "Business City",
    state: "NY",
    postalCode: "67890",
    country: "United States",
    isDefault: false,
  },
];

type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingAddress) {
      setEditingAddress({ ...editingAddress, [name]: value });
    } else {
      setNewAddress({ ...newAddress, [name]: value });
    }
  };
  
  const resetForm = () => {
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    });
    setEditingAddress(null);
    setIsAddDialogOpen(false);
  };
  
  const handleAddAddress = () => {
    const id = `addr_${Date.now()}`;
    const isDefault = addresses.length === 0;
    
    setAddresses([...addresses, { ...newAddress, id, isDefault }]);
    toast.success("Address added successfully");
    resetForm();
  };
  
  const handleUpdateAddress = () => {
    if (!editingAddress) return;
    
    setAddresses(addresses.map(addr => 
      addr.id === editingAddress.id ? editingAddress : addr
    ));
    toast.success("Address updated successfully");
    resetForm();
  };
  
  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast.success("Address deleted successfully");
    
    // If the deleted address was the default one, set the first remaining address as default
    if (addressToDelete?.isDefault && addresses.length > 1) {
      const remainingAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(
        remainingAddresses.map((addr, index) => 
          index === 0 ? { ...addr, isDefault: true } : addr
        )
      );
    }
  };
  
  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast.success("Default address updated");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Addresses</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 py-4">
              <div>
                <Label htmlFor="name">Address Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Home, Work, etc."
                  value={editingAddress?.name || newAddress.name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  placeholder="123 Main St"
                  value={editingAddress?.street || newAddress.street}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={editingAddress?.city || newAddress.city}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    value={editingAddress?.state || newAddress.state}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={editingAddress?.postalCode || newAddress.postalCode}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={editingAddress?.country || newAddress.country}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button 
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                disabled={
                  !editingAddress && (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.postalCode) ||
                  editingAddress && (!editingAddress.name || !editingAddress.street || !editingAddress.city || !editingAddress.state || !editingAddress.postalCode)
                }
              >
                {editingAddress ? "Update" : "Save"} Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              {address.isDefault && (
                <div className="absolute top-3 right-3">
                  <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Default
                  </div>
                </div>
              )}
              
              <div className="mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">{address.name}</h3>
              </div>
              
              <div className="text-gray-600 text-sm space-y-1">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingAddress(address);
                    setIsAddDialogOpen(true);
                  }}
                  className="gap-1 text-gray-600 hover:text-gray-900"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                  className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={addresses.length === 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefaultAddress(address.id)}
                    className="gap-1 text-primary hover:text-primary/80 ml-auto"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Set as Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses added yet</h3>
          <p className="text-gray-600 mb-6">
            Add your delivery address to make checkout faster.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Your First Address
          </Button>
        </div>
      )}
    </div>
  );
};

export default Addresses;
