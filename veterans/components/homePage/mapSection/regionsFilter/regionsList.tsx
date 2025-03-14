'use client';

import regionsArray from 'data/RegionsArray';
import React, { useState, useEffect, useRef } from 'react';

import st from './regionsList.module.css';

interface RegionsListProps {
  readonly setSelectedRegion: (region: string) => void;
}

function RegionsList({ setSelectedRegion }: RegionsListProps) {
  const defaultRegion = regionsArray.find(
    (region) => region.name === 'Всі',
  ) || { name: '', numOfInitiatives: 0 };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegionLocal] = useState<string | undefined>(
    defaultRegion.name,
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRegionSelect = (region: {
    name: string;
    numOfInitiatives?: number;
  }) => {
    setSelectedRegionLocal(region.name);
    setSelectedRegion(region.name);
    setIsOpen(false);
    setFocusedIndex(null);
    buttonRef.current?.focus();
  };

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
            prev === null ? 0 : Math.min(prev + 1, regionsArray.length - 1);
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
            prev === null ? regionsArray.length - 1 : Math.max(prev - 1, 0);
          itemsRef.current[nextIndex]?.focus();
          return nextIndex;
        });
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (focusedIndex !== null) {
          handleRegionSelect(regionsArray[focusedIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      listRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className={st.regions_wrapper}>
      <h3 className={st.region_list_title}>Область</h3>
      <div className={st.region_selector} ref={dropdownRef}>
        <button
          id="region-selector"
          ref={buttonRef}
          data-testid="btn-for-region-selection"
          className={`${st.region_selector_btn} ${isOpen ? st.open : ''}`}
          onClick={toggleDropdown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="region-list"
        >
          <span className={st.region_name}>{selectedRegion}</span>
        </button>

        {isOpen && (
          <div
            id="region-list"
            data-testid="list-of-regions"
            ref={listRef}
            className={`${st.region_selector_list} ${isOpen ? st.show : ''}`}
            role="menu"
            aria-activedescendant={
              focusedIndex !== null ? `region-${focusedIndex}` : undefined
            }
            onKeyDown={handleKeyDown}
          >
            {regionsArray.map((region, index) => (
              <div
                key={region.name}
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
                tabIndex={0}
                className={`${st.region_selector_item} ${
                  focusedIndex === index ? st.focused : ''
                }`}
                aria-checked={selectedRegion === region.name}
                aria-label={`Select ${region.name}`}
              >
                <span className={st.region_name}>{region.name}</span>
                <span className={st.num_of_initiatives}>
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
