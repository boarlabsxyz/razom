'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REGIONS, type Region } from '@helpers/queries';

import Spinner from '@comComps/spinner';

import st from './regionsList.module.css';

interface RegionsListProps {
  readonly selectedRegion?: string;
  readonly setSelectedRegion: (region: string) => void;
}

function RegionsList({ selectedRegion, setSelectedRegion }: RegionsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { data, loading, error } = useQuery(GET_REGIONS);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const regions = data?.regions || [];

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      if (!prev) {
        const selectedIndex = regions.findIndex(
          (region: Region) => region.name === selectedRegion,
        );

        let focusIndex = 0;
        if (selectedRegion !== 'Всі' && selectedIndex !== -1) {
          focusIndex = selectedIndex;
        }

        setFocusedIndex(focusIndex);
        setTimeout(() => {
          itemsRef.current[focusIndex]?.focus();
        }, 0);
      }
      return !prev;
    });
  };

  const handleRegionSelect = useCallback(
    (region: Region) => {
      setSelectedRegion(region.name);
      setIsOpen(false);
      setFocusedIndex(
        regions.findIndex((reg: Region) => reg.name === region.name),
      );
      buttonRef.current?.focus();
    },
    [setSelectedRegion, setIsOpen, setFocusedIndex, regions, buttonRef],
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setFocusedIndex(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(null);
      buttonRef.current?.focus();
    } else if (isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Tab') {
        event.preventDefault();
        setFocusedIndex((prev) => {
          const nextIndex =
            prev === null || prev === regions.length - 1 ? 0 : prev + 1;
          itemsRef.current[nextIndex]?.focus();
          return nextIndex;
        });
      } else if (
        event.key === 'ArrowUp' ||
        (event.shiftKey && event.key === 'Tab')
      ) {
        event.preventDefault();
        setFocusedIndex((prev) => {
          const nextIndex =
            prev === null || prev === 0 ? regions.length - 1 : prev - 1;
          itemsRef.current[nextIndex]?.focus();
          return nextIndex;
        });
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (focusedIndex !== null) {
          handleRegionSelect(regions[focusedIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      listRef.current?.focus();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Помилка завантаження регіонів</div>;
  }

  return (
    <div className={st['regions-wrapper']}>
      <h3 className={st['region-list-title']}>Область</h3>
      <div className={st['region-selector']} ref={dropdownRef}>
        <button
          id="region-selector"
          ref={buttonRef}
          data-testid="btn-for-region-selection"
          className={`${st['region-selector-btn']} ${isOpen ? st.open : ''}`}
          onClick={toggleDropdown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="region-list"
        >
          <span className={st['region-name']}>{selectedRegion}</span>
        </button>

        {isOpen && (
          <div
            id="region-list"
            data-testid="list-of-regions"
            ref={listRef}
            tabIndex={0}
            className={`${st['region-selector-list']} ${isOpen ? st.show : ''}`}
            role="menu"
            aria-activedescendant={
              focusedIndex !== null ? `region-${focusedIndex}` : undefined
            }
            onKeyDown={handleKeyDown}
          >
            {regions.map((region: Region, index: number) => (
              <div
                key={region.id}
                id={`region-${index}`}
                role="menuitemradio"
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                onClick={() => handleRegionSelect(region)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleRegionSelect(region);
                  }
                }}
                tabIndex={-1}
                className={`${st['region-selector-item']} ${
                  focusedIndex === index ? st.focused : ''
                }`}
                aria-checked={selectedRegion === region.name}
                aria-label={`Select ${region.name}`}
              >
                <span className={st['region-name']}>{region.name}</span>
                <span className={st['num-of-initiatives']}>
                  ({region.numOfInitiatives})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionsList;
