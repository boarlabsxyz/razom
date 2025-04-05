'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REGIONS, type Region } from '@helpers/queries';
import { RegionsListProps } from './types';
import Spinner from '@comComps/spinner';

import st from './regionsList.module.css';

const DEFAULT_REGION_NAME = 'Всі області';
const SEARCH_PLACEHOLDER = 'Укажіть область...';
const UKRAINIAN_TEXT_REGEX = /^[а-яґєіїё]+$/iu;

function RegionsList({
  selectedRegion,
  setSelectedRegion,
}: Readonly<RegionsListProps>) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_REGIONS);
  const [inputValue, setInputValue] = useState('');

  const isUkrainianText = useCallback(
    (text: string) => UKRAINIAN_TEXT_REGEX.test(text),
    [],
  );

  const regions = data?.regions ?? [];
  const filteredRegions = regions.filter((region: Region) =>
    isUkrainianText(inputValue)
      ? region.name.toLowerCase().includes(inputValue.toLowerCase())
      : true,
  );

  const defaultRegion = regions.find(
    (region: Region) => region.name === DEFAULT_REGION_NAME,
  ) ?? {
    name: '',
    numOfInitiatives: 0,
  };

  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    regions.findIndex((region: Region) => region.name === defaultRegion.name),
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      if (!prev) {
        const selectedIndex = regions.findIndex(
          (region: Region) => region.name === selectedRegion,
        );

        let focusIndex = 0;
        if (selectedRegion !== 'Всі області' && selectedIndex !== -1) {
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

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
      setInputValue('');
      setFocusedIndex(null);
    }
  }, []);

  const calculatePreviousTabOrArrowUpIndex = (
    focusedIndex: number | null,
    length: number,
  ): number => {
    return focusedIndex === null || focusedIndex <= 0
      ? length - 1
      : focusedIndex - 1;
  };

  const calculateNextTabOrArrowDownIndex = (
    focusedIndex: number | null,
    length: number,
  ): number => {
    return focusedIndex === null || focusedIndex >= length - 1
      ? 0
      : focusedIndex + 1;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setFocusedIndex(null);
    },
    [],
  );

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
            ? calculatePreviousTabOrArrowUpIndex(
                focusedIndex,
                filteredRegions.length,
              )
            : calculateNextTabOrArrowDownIndex(
                focusedIndex,
                filteredRegions.length,
              );
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          newIndex = calculateNextTabOrArrowDownIndex(
            focusedIndex,
            filteredRegions.length,
          );
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          newIndex = calculatePreviousTabOrArrowUpIndex(
            focusedIndex,
            filteredRegions.length,
          );
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

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const renderRegionList = () => {
    if (error) {
      return <div>Помилка завантаження регіонів</div>;
    }

    if (loading) {
      return <Spinner data-testid="loader" />;
    }

    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={SEARCH_PLACEHOLDER}
          className={st['region-search-input']}
          data-testid="region-search-input"
          aria-label="Пошук регіону"
          aria-controls="region-list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          aria-owns="region-list"
          aria-activedescendant={
            focusedIndex !== null ? `region-${focusedIndex}` : undefined
          }
        />
        {filteredRegions.map((region: Region, index: number) => (
          <div
            key={region.id}
            id={`region-${index}`}
            role="menuitemradio"
            ref={(el) => {
              itemsRef.current[index] = el;
            }}
            onClick={() => handleRegionSelect(region)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
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
    );
  };

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
            {renderRegionList()}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionsList;
