'use client';

import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getBrandName, getDrugName, getBatchNumber } from '@/app/lib/actions';

type TBreadCrumbProps = {
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const pathname = usePathname();
  const [names, setNames] = useState<{ [key: string]: string }>({});

  // Memoize the filtered segments calculation
  const filteredSegments = useMemo(() => {
    const pathSegments = pathname.split('/').filter((segment) => segment);
    return pathSegments.reduce((acc, segment, index) => {
      if (['brand', 'drug', 'batch'].includes(segment)) {
        const id = pathSegments[index + 1];
        if (id) {
          acc.push({ type: segment, id });
        }
      }
      return acc;
    }, [] as { type: string; id: string }[]);
  }, [pathname]);

  useEffect(() => {
    const fetchNames = async () => {
      const newNames: { [key: string]: string } = {};
      
      for (const segment of filteredSegments) {
        const id = parseInt(segment.id);
        if (isNaN(id)) continue;

        switch (segment.type) {
          case 'brand':
            newNames[`brand-${segment.id}`] = await getBrandName(id);
            break;
          case 'drug':
            newNames[`drug-${segment.id}`] = await getDrugName(id);
            break;
          case 'batch':
            newNames[`batch-${segment.id}`] = await getBatchNumber(id);
            break;
        }
      }
      
      setNames(newNames);
    };

    fetchNames();
  }, [filteredSegments]); // Now safe to include filteredSegments

  return (
    <ul className={containerClasses}>
      <li className={listClasses}>
        <Link href="/inventory/completed-stocks?selection=model">Completed-Stock</Link>
      </li>
      {filteredSegments.length > 0 && separator}
      {filteredSegments.map((segment, index) => {
        const href = `/inventory/completed-stocks/${segment.type}/${segment.id}`;
        const itemClasses = pathname.includes(href) && index === filteredSegments.length - 1
          ? `${listClasses} ${activeClasses}`
          : listClasses;
        
        const nameKey = `${segment.type}-${segment.id}`;
        const displayName = names[nameKey] || `${segment.type}-${segment.id}`;
        const itemLink = capitalizeLinks
          ? `${displayName[0].toUpperCase()}${displayName.slice(1)}`
          : displayName;

        return (
          <React.Fragment key={index}>
            <li className={itemClasses}>
              <Link href={href}>{itemLink}</Link>
            </li>
            {index < filteredSegments.length - 1 && separator}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

export default NextBreadcrumb;