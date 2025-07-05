import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, MapPin } from 'lucide-react';

interface AddressSearchProps {
  onAddressSelect: (address: string) => void;
  placeholder?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ 
  onAddressSelect, 
  placeholder = "Enter job site address..." 
}) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = () => {
    if (address.trim()) {
      onAddressSelect(address);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Mock suggestions for demo - in real app, this would use Google Places API
  const mockSuggestions = [
    "337 Ayers Orchard Rd, Stuart, VA 24171",
    "703 W Decatur St, Madison, NC 27025",
    "Main St, Stuart, VA",
    "Highway 58, Stuart, VA"
  ];

  const handleInputChange = (value: string) => {
    setAddress(value);
    if (value.length > 2) {
      const filtered = mockSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="address-search"
            type="text"
            placeholder={placeholder}
            value={address}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch} size="default">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left p-2 hover:bg-muted rounded-md transition-colors text-sm"
                onClick={() => {
                  setAddress(suggestion);
                  onAddressSelect(suggestion);
                  setSuggestions([]);
                }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AddressSearch;