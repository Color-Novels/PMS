"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useCallback, forwardRef, useEffect, useImperativeHandle } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterSectionProps {
  id: string;
  title: string;
  items: {
    id: number;
    name: string;
  }[];
  applyOnClick?: boolean;
}

export interface FilterSectionRef {
  reset: () => void;
  getSelectedItems: () => { id: string; selectedItems: string[] };
}

export const FilterSection = forwardRef<FilterSectionRef, FilterSectionProps>(
  ({ id, title, items, applyOnClick = true }, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get current selected items from URL parameters
    const getCurrentSelectedItems = useCallback(() => {
      const paramValue = searchParams.get(id);
      return paramValue ? paramValue.split(',') : [];
    }, [searchParams, id]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>(getCurrentSelectedItems());
    const allChecked = selectedItems.length === items.length;
    
    // Update selected items when URL params change
    useEffect(() => {
      setSelectedItems(getCurrentSelectedItems());
    }, [getCurrentSelectedItems]);
    
    // Filter items based on search term
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateUrlParams = useCallback((newSelectedItems: string[]) => {
      if (!applyOnClick) return;
      
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (newSelectedItems.length > 0) {
        current.set(id, newSelectedItems.join(','));
      } else {
        current.delete(id);
      }
      
      const search = current.toString();
      const query = search ? `?${search}` : "";
      
      router.push(`${window.location.pathname}${query}`, { scroll: false });
    }, [router, searchParams, id, applyOnClick]);

    const handleSelectAll = () => {
      const newSelectedItems = allChecked 
        ? [] 
        : items.map(item => item.id.toString());
      
      setSelectedItems(newSelectedItems);
      updateUrlParams(newSelectedItems);
    };

    const handleItemChange = (itemId: number) => {
      const itemIdStr = itemId.toString();
      const newSelectedItems = selectedItems.includes(itemIdStr)
        ? selectedItems.filter(i => i !== itemIdStr)
        : [...selectedItems, itemIdStr];
      
      setSelectedItems(newSelectedItems);
      updateUrlParams(newSelectedItems);
    };

    // Reset function to clear all selections
    const reset = useCallback(() => {
      setSelectedItems([]);
      if (applyOnClick) {
        updateUrlParams([]);
      }
    }, [updateUrlParams, applyOnClick]);
    
    // Function to get current selected items
    const getSelectedItems = useCallback(() => {
      return { id, selectedItems };
    }, [id, selectedItems]);

    // Expose the reset function through the ref
    useImperativeHandle(ref, () => ({
      reset,
      getSelectedItems
    }));

    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="hover:no-underline">
          <span className="text-sm font-medium">{title}</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`select-all-${id}`} 
                checked={allChecked}
                onCheckedChange={handleSelectAll}
              />
              <Label 
                htmlFor={`select-all-${id}`}
                className="text-sm cursor-pointer"
              >
                Select All
              </Label>
            </div>
            
            <Input
              placeholder={`Search ${title.toLowerCase()}`}
              className="h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${id}-${item.id}`}
                    checked={selectedItems.includes(item.id.toString())}
                    onCheckedChange={() => handleItemChange(item.id)}
                  />
                  <Label 
                    htmlFor={`${id}-${item.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {item.name}
                  </Label>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-sm text-gray-500 italic">No matches found</p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);

// Display name for debugging
FilterSection.displayName = "FilterSection";

interface FilterSectionOnlyNameProps {
  id: string;
  title: string;
  items: string[];
  applyOnClick?: boolean;
}

export const FilterSectionOnlyName = forwardRef<FilterSectionRef, FilterSectionOnlyNameProps>(
  ({ id, title, items, applyOnClick = true }, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get current selected items from URL parameters
    const getCurrentSelectedItems = useCallback(() => {
      const paramValue = searchParams.get(id);
      return paramValue ? paramValue.split(',') : [];
    }, [searchParams, id]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItems, setSelectedItems] = useState<string[]>(getCurrentSelectedItems());
    const allChecked = selectedItems.length === items.length;
    
    // Update selected items when URL params change
    useEffect(() => {
      setSelectedItems(getCurrentSelectedItems());
    }, [getCurrentSelectedItems]);
    
    const filteredItems = items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const updateUrlParams = useCallback((newSelectedItems: string[]) => {
      if (!applyOnClick) return;
      
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (newSelectedItems.length > 0) {
        current.set(id, newSelectedItems.join(','));
      } else {
        current.delete(id);
      }
      
      const search = current.toString();
      const query = search ? `?${search}` : "";
      
      router.push(`${window.location.pathname}${query}`, { scroll: false });
    }, [router, searchParams, id, applyOnClick]);

    const handleSelectAll = () => {
      const newSelectedItems = allChecked ? [] : [...items];
      setSelectedItems(newSelectedItems);
      updateUrlParams(newSelectedItems);
    };

    const handleItemChange = (item: string) => {
      const newSelectedItems = selectedItems.includes(item)
        ? selectedItems.filter(i => i !== item)
        : [...selectedItems, item];
      
      setSelectedItems(newSelectedItems);
      updateUrlParams(newSelectedItems);
    };

    // Reset function to clear all selections
    const reset = useCallback(() => {
      console.log("Resetting", id);
      setSelectedItems([]);
      if (applyOnClick) {
        updateUrlParams([]);
      }
    }, [id, updateUrlParams, applyOnClick]);
    
    // Function to get current selected items
    const getSelectedItems = useCallback(() => {
      return { id, selectedItems };
    }, [id, selectedItems]);

    // Expose functions through the ref
    useImperativeHandle(ref, () => ({
      reset,
      getSelectedItems
    }));

    return (
      <AccordionItem value={id}>
        <AccordionTrigger className="hover:no-underline">
          <span className="text-sm font-medium">{title}</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`select-all-${id}`} 
                checked={allChecked}
                onCheckedChange={handleSelectAll}
              />
              <Label 
                htmlFor={`select-all-${id}`}
                className="text-sm cursor-pointer"
              >
                Select All
              </Label>
            </div>
            
            <Input
              placeholder={`Search ${title.toLowerCase()}`}
              className="h-8 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {filteredItems.map(item => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${id}-${item}`}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => handleItemChange(item)}
                  />
                  <Label 
                    htmlFor={`${id}-${item}`}
                    className="text-sm cursor-pointer"
                  >
                    {item}
                  </Label>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-sm text-gray-500 italic">No matches found</p>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }
);

// Display name for debugging
FilterSectionOnlyName.displayName = "FilterSectionOnlyName";