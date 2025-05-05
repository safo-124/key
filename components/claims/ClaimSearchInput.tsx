// components/claims/ClaimSearchInput.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce'; // Install: npm i use-debounce

interface ClaimSearchInputProps {
    initialQuery?: string; // To pre-fill the input if needed
}

export function ClaimSearchInput({ initialQuery = '' }: ClaimSearchInputProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);

    // Debounce the navigation function to avoid excessive updates while typing
    const debouncedNavigate = useDebouncedCallback((newQuery: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (newQuery) {
            current.set('query', newQuery);
        } else {
            current.delete('query'); // Remove query param if input is empty
        }

        // Optional: Reset page number if pagination exists
        current.delete('page');

        const search = current.toString();
        const newUrl = `${pathname}${search ? `?${search}` : ''}`;

        console.log(`Applying search: "${newQuery}", navigating to: ${newUrl}`);
        router.push(newUrl, { scroll: false }); // Navigate without scrolling
    }, 500); // Debounce time in milliseconds (e.g., 500ms)

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedNavigate(newQuery);
    };

    // Function to clear the search input and URL query
    const clearSearch = () => {
        setQuery('');
        debouncedNavigate('');
    };

    // Effect to update local state if the URL changes externally
    useEffect(() => {
        setQuery(searchParams.get('query') || '');
    }, [searchParams]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search" // Use type="search" for potential browser clear button
                placeholder="Search by submitter, ID, type..."
                value={query}
                onChange={handleChange}
                className="w-full rounded-md bg-background pl-9 pr-8 h-10" // Add padding for icons
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
