'use client';

import regionsArray from 'data/RegionsArray';
import React, { useState, useEffect, useRef } from 'react';

import st from './regionsList.module.css';

interface RegionsListProps {
  setCurrentRegion?: (region: string) => void;
}

function RegionsList({ setCurrentRegion }: Readonly<RegionsListProps>) {
  const defaultRegion = regionsArray.find(
    (region) => region.name === 'Всі',
  ) || {
    name: '',
    numOfInitiatives: 0,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    defaultRegion.name,
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    regionsArray.findIndex((region) => region.name === defaultRegion.name),
  );
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const isUkrainianText = (text: string) => /^[а-яґєіїё]+$/iu.test(text);

  const filteredRegions = regionsArray.filter((region) =>
    isUkrainianText(searchTerm)
      ? region.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setSearchTerm('');
        setTimeout(() => {
          const startIndex =
            selectedRegion === 'Всі' ? null : (focusedIndex ?? 0);
          setFocusedIndex(startIndex);
          if (startIndex !== null) {
            itemsRef.current[startIndex]?.focus();
          }
        }, 0);
      }
      return !prev;
    });
  };

  const handleRegionSelect = (region: {
    name: string;
    numOfInitiatives?: number;
  }) => {
    setSelectedRegion(region.name);
    setIsOpen(false);
    setSearchTerm('');
    if (region.name === 'Всі') {
      setFocusedIndex(0);
    } else {
      setFocusedIndex(
        regionsArray.findIndex((reg) => reg.name === region.name),
      );
    }
    buttonRef.current?.focus();
    if (setCurrentRegion) {
      setCurrentRegion(region.name);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(null);
    } else if (isOpen) {
      if (event.key.length === 1 && isUkrainianText(event.key)) {
        event.preventDefault();
        setSearchTerm((prev) => {
          const newTerm = prev + event.key;
          return newTerm;
        });
        setTimeout(() => {
          listRef.current?.focus();
        }, 0);
      } else if (event.key === 'Backspace') {
        setSearchTerm((prev) => prev.slice(0, -1));
      } else if (event.key === 'ArrowDown' || event.key === 'Tab') {
        event.preventDefault();
        setFocusedIndex((prev) => {
          const nextIndex =
            prev === null || prev === filteredRegions.length - 1 ? 0 : prev + 1;
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
            prev === null || prev === 0 ? filteredRegions.length - 1 : prev - 1;
          itemsRef.current[nextIndex]?.focus();
          return nextIndex;
        });
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (focusedIndex !== null) {
          handleRegionSelect(filteredRegions[focusedIndex]);
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
            {filteredRegions.map((region, index) => (
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
