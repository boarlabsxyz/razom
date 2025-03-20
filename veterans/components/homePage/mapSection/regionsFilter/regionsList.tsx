'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import regionsArray from 'data/RegionsArray';

import { Region, RegionsListProps } from './types';

import st from './regionsList.module.css';

const DEFAULT_REGION_NAME = 'Всі';
const SEARCH_PLACEHOLDER = 'Укажіть область...';
const UKRAINIAN_TEXT_REGEX = /^[а-яґєіїё]+$/iu;

function RegionsList({ setCurrentRegion }: Readonly<RegionsListProps>) {
  const defaultRegion = regionsArray.find(
    (region) => region.name === DEFAULT_REGION_NAME,
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
  const [inputValue, setInputValue] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUkrainianText = useCallback(
    (text: string) => UKRAINIAN_TEXT_REGEX.test(text),
    [],
  );

  const filteredRegions = regionsArray.filter((region) =>
    isUkrainianText(inputValue)
      ? region.name.toLowerCase().includes(inputValue.toLowerCase())
      : true,
  );

  const scrollToElement = useCallback((element: HTMLElement) => {
    try {
      if (typeof element.scrollIntoView === 'function') {
        element.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    } catch {
      element.focus();
    }
  }, []);

  const handleRegionSelect = useCallback(
    (region: Region) => {
      setSelectedRegion(region.name);
      setIsOpen(false);
      setInputValue('');
      setFocusedIndex(
        region.name === DEFAULT_REGION_NAME
          ? 0
          : regionsArray.findIndex((reg) => reg.name === region.name),
      );
      buttonRef.current?.focus();
      setCurrentRegion?.(region.name);
    },
    [setCurrentRegion],
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setInputValue('');
      setFocusedIndex(null);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) {
        return;
      }

      let newIndex: number;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          newIndex = e.shiftKey
            ? focusedIndex === null || focusedIndex <= 0
              ? filteredRegions.length - 1
              : focusedIndex - 1
            : focusedIndex === null ||
                focusedIndex >= filteredRegions.length - 1
              ? 0
              : focusedIndex + 1;
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex =
            focusedIndex === null || focusedIndex >= filteredRegions.length - 1
              ? 0
              : focusedIndex + 1;
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex =
            focusedIndex === null || focusedIndex <= 0
              ? filteredRegions.length - 1
              : focusedIndex - 1;
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex !== null) {
            handleRegionSelect(filteredRegions[focusedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setInputValue('');
          setFocusedIndex(null);
          break;
      }
    },
    [isOpen, focusedIndex, filteredRegions, handleRegionSelect],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setFocusedIndex(null);
    },
    [],
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setInputValue('');
        setTimeout(() => {
          if (selectedRegion !== DEFAULT_REGION_NAME) {
            const selectedElement = itemsRef.current[focusedIndex || 0];
            if (selectedElement) {
              selectedElement.focus();
              scrollToElement(selectedElement);
            }
          } else {
            inputRef.current?.focus();
          }
        }, 0);
      }
      return !prev;
    });
  }, [selectedRegion, focusedIndex, scrollToElement]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

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
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={SEARCH_PLACEHOLDER}
              className={st['region-search-input']}
              data-testid="region-search-input"
            />
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
                tabIndex={focusedIndex === index ? 0 : -1}
                className={`${st['region-selector-item']} ${
                  focusedIndex === index ? st.focused : ''
                } ${selectedRegion === region.name ? st.selected : ''}`}
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
