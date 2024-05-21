'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import { useMarketplaceAuction } from '../Providers/marketplace-auctions-provider';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

import FilterCombobox from './filter-combobox';

const sort_by_auctions = [
  { value: 'new-bids', label: 'New' },
  // { value: 'most-bids', label: 'Most Bids' },
  { value: 'ending-soon', label: 'Ending Soon' },
];

const sort_by_price = [
  { value: 'highest-base-price', label: 'Highest Base Price' },
  { value: 'lowest-base-price', label: 'Lowest Base Price' },
  { value: 'highest-buy-price', label: 'Highest Buy Price' },
  { value: 'lowest-buy-price', label: 'Lowest Buy Price' },
];

const categories = [
  { label: 'Laptop', value: 'laptop' },
  { label: 'Mobile', value: 'mobile' },
] as const;

export default function Sidebar() {
  const { setFilterValue, loading } = useMarketplaceAuction();

  const [searchInput, setSearchInput] = useState('');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('');

  const [sortAuctionOpen, setSortAuctionOpen] = useState(false);
  const [selectedSortAuction, setSelectedSortAuction] = React.useState('');

  const [sortPriceOpen, setSortPriceOpen] = useState(false);
  const [selectedSortPrice, setSelectedSortPrice] = React.useState('');

  return (
    <div className="sticky top-20 ">
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-2xl font-semibold">Filter Auctions</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <FaSearch />
              <Input
                placeholder="Search auctions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Category</h2>
                <div>
                  <FilterCombobox
                    list={categories}
                    open={categoryOpen}
                    setOpen={setCategoryOpen}
                    selectedValue={selectedCategory}
                    setSelectedValue={setSelectedCategory}
                    showLabel="category"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Sort (Auctions)</h2>
                <div>
                  <FilterCombobox
                    list={sort_by_auctions}
                    open={sortAuctionOpen}
                    setOpen={setSortAuctionOpen}
                    selectedValue={selectedSortAuction}
                    setSelectedValue={setSelectedSortAuction}
                    showLabel="auction type"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Sort (Price)</h2>
                <div>
                  <FilterCombobox
                    list={sort_by_price}
                    open={sortPriceOpen}
                    setOpen={setSortPriceOpen}
                    selectedValue={selectedSortPrice}
                    setSelectedValue={setSelectedSortPrice}
                    showLabel="price type"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          {(searchInput ||
            selectedCategory ||
            selectedSortAuction ||
            selectedSortPrice) && (
            <Button
              variant={'outline'}
              disabled={loading}
              onClick={() => {
                setSearchInput('');
                setSelectedCategory('');
                setSelectedSortAuction('');
                setSelectedSortPrice('');
                setFilterValue({
                  searchInput: '',
                  category: '',
                  sortTypePrice: '',
                  sortTypeAuction: '',
                });
              }}
            >
              Clear
            </Button>
          )}
          <Button
            onClick={() => {
              setFilterValue({
                searchInput: searchInput,
                category: selectedCategory,
                sortTypeAuction: selectedSortAuction,
                sortTypePrice: selectedSortPrice,
              });
            }}
            disabled={loading}
          >
            Search
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
