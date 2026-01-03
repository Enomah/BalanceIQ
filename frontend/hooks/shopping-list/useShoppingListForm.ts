import { useState, useCallback } from "react";
import { ShoppingListItem } from "@/types/dashboardTypes";

interface UseShoppingListFormProps {
  initialName?: string;
  initialItems?: ShoppingListItem[];
}

export const useShoppingListForm = ({
  initialName = "",
  initialItems = [],
}: UseShoppingListFormProps = {}) => {
  const [name, setName] = useState(initialName);
  const [items, setItems] = useState<ShoppingListItem[]>(initialItems);
  const [newItem, setNewItem] = useState<{
    name: string;
    quantity: number;
    unit: string;
    price: number;
    category: ShoppingListItem["category"];
  }>({
    name: "",
    quantity: 1,
    unit: "pcs",
    price: 0,
    category: "other",
  });

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const addItem = useCallback(() => {
    if (!newItem.name || newItem.price <= 0) return;

    setItems((prev) => [
      ...prev,
      {
        ...newItem,
        _id: `temp-${Date.now()}`,
        checked: false,
      },
    ]);

    setNewItem({
      name: "",
      quantity: 1,
      unit: "pcs",
      price: 0,
      category: "other",
    });
  }, [newItem]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const updateItem = useCallback(
    (id: string, updates: Partial<ShoppingListItem>) => {
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const toggleItemChecked = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setItems([]);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pcs",
      price: 0,
      category: "other",
    });
  }, []);

  const removeCheckedItems = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.checked));
  }, []);

  return {
    name,
    setName,
    items,
    newItem,
    setNewItem,
    totalPrice,
    addItem,
    removeItem,
    updateItem,
    toggleItemChecked,
    removeCheckedItems,
    resetForm,
  };
};
