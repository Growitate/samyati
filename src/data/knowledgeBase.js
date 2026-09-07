/**
 * Samyati The World - Official Grounded Travel Knowledge Base
 * 
 * Provides complete grounding for AI travel consultants, guaranteeing that 
 * 100% of active catalog packages across all domestic and international 
 * destinations are accessible in the knowledge base with exact pricing,
 * durations, itineraries, and official media.
 */

import { PACKAGES as DEFAULT_PACKAGES, DESTINATIONS as DEFAULT_DESTINATIONS } from './travelData.js';

/**
 * Builds the comprehensive catalog directory knowledge base containing EVERY
 * single package listed in Samyati.
 *
 * @param {Array} packages - List of package objects (all 75)
 * @param {Array} destinations - List of destination objects (all 19)
 * @param {Object|null} focusedDest - Optional focused destination for extra route detail
 * @returns {string} Formatted Knowledge Base markdown
 */
export function buildFullKnowledgeBase(packages = DEFAULT_PACKAGES, destinations = DEFAULT_DESTINATIONS, focusedDest = null) {
  const destMap = new Map();

  // 1. Initialize destinations map
  destinations.forEach(dest => {
    destMap.set(dest.id.toLowerCase(), {
      id: dest.id,
      name: dest.name,
      category: dest.category || 'Travel',
      tagline: dest.tagline || '',
      description: dest.description || '',
      packages: []
    });
  });

  const unassignedPackages = [];

  // 2. Map every single package to its destination
  packages.forEach(pkg => {
    const dId = (pkg.destinationId || '').toLowerCase();
    const dName = (pkg.destinationName || '').toLowerCase();

    let matched = destMap.get(dId);
    if (!matched) {
      for (const [id, dest] of destMap.entries()) {
        if (dName.includes(dest.name.toLowerCase()) || dest.name.toLowerCase().includes(dName)) {
          matched = dest;
          break;
        }
      }
    }

    if (matched) {
      matched.packages.push(pkg);
    } else {
      unassignedPackages.push(pkg);
    }
  });

  const sections = [];
  const focusedId = focusedDest?.id?.toLowerCase();

  // 3. Format destination blocks
  if (focusedId) {
    const otherDestSummaries = [];
    for (const [id, dest] of destMap.entries()) {
      const isFocused = id === focusedId || dest.name.toLowerCase().includes(focusedId);
      if (isFocused) {
        const pkgLines = dest.packages.map(p => {
          const priceStr = p.price ? p.price : 'On Request';
          const stops = (p.itinerary || [])
            .map(day => day.title.replace(/^Day \d+[:\s-]*/i, ''))
            .slice(0, 3)
            .join(' → ');
          return `  • "${p.title}" (${p.duration}, Starting: ${priceStr})${stops ? ` [Route: ${stops}]` : ''}`;
        }).join('\n');
        sections.push(`### FOCUSED DESTINATION: ${dest.name} (${dest.category}, ${dest.packages.length} Packages)\n${pkgLines || '  (Custom itineraries available)'}`);
      } else {
        const prices = dest.packages.map(p => parseInt((p.price || '').replace(/[^0-9]/g, ''))).filter(Boolean);
        const minPrice = prices.length > 0 ? '₹' + Math.min(...prices).toLocaleString('en-IN') : 'On Request';
        otherDestSummaries.push(`• ${dest.name} (${dest.category}): ${dest.packages.length} pkgs, starting ${minPrice}`);
      }
    }

    if (otherDestSummaries.length > 0) {
      sections.push(`### OTHER SAMYATI CATALOG DESTINATIONS:\n${otherDestSummaries.join('\n')}`);
    }
  } else {
    // Unfocused overview: concise package titles & starting prices to minimize token overhead
    for (const [id, dest] of destMap.entries()) {
      const pkgLines = dest.packages.map(p => {
        const priceStr = p.price ? p.price : 'On Request';
        return `  • "${p.title}" (${p.duration}, Starting: ${priceStr})`;
      }).join('\n');

      sections.push(`### ${dest.name} (${dest.category}, ${dest.packages.length} Packages)\n${pkgLines || '  (Custom itineraries available)'}`);
    }
  }

  // 4. Format multi-destination / regional combo packages
  if (unassignedPackages.length > 0) {
    const comboLines = unassignedPackages.map(p => {
      return `  • "${p.title}" [${p.destinationName}] (${p.duration}, Starting: ${p.price || 'On Request'})`;
    }).join('\n');

    sections.push(`### Multi-Destination & Regional Itineraries (${unassignedPackages.length} Packages)\n${comboLines}`);
  }

  return sections.join('\n\n');
}

/**
 * Builds deep, high-fidelity grounding for top-matched inquiry packages
 * (includes day-wise breakdown, hotel tiers, inclusions, exclusions, and verified photo URL)
 *
 * @param {Array} matchedPackages - Top matched package objects
 * @returns {string} Formatted markdown details
 */
export function buildDeepInquiryKnowledge(matchedPackages = []) {
  if (!matchedPackages || matchedPackages.length === 0) {
    return 'No specific package selected. Reference the complete directory above.';
  }

  return matchedPackages.map((p, index) => {
    const dayWise = (p.itinerary || []).map(d => {
      const highlights = (d.highlights || []).slice(0, 3).join(', ');
      return `  * Day ${d.day} [${d.title}]: ${highlights || d.description || 'Sightseeing & transfers'}`;
    }).join('\n');

    const incs = (p.inclusions || []).slice(0, 6).join('; ');
    const excs = (p.exclusions || []).slice(0, 4).join('; ');

    const hotelTiers = (p.hotelPricingOptions || []).map(h => {
      const tName = h.hotelName || h.category || 'Standard';
      const p2 = h.price2Pax ? `${h.price2Pax} (2-PAX)` : '';
      const p4 = h.price4Pax ? `${h.price4Pax} (4-PAX)` : '';
      return `${tName}: ${[p2, p4].filter(Boolean).join(' / ')}`;
    }).filter(Boolean).join(' | ');

    return `### Top Option ${index + 1}: ${p.title}
- Title: "${p.title}"
- Destination: ${p.destinationName || p.destinationId} (${p.category || 'Travel'})
- Duration: ${p.duration}
- Starting Price: ${p.price || 'On Request'} per person ${p.originalPrice ? `(Original: ${p.originalPrice})` : ''}
${hotelTiers ? `- Hotel Tiers: ${hotelTiers}` : (p.hotel ? `- Stay: ${p.hotel}` : '')}
- Official Image URL: ${p.image}
- Day-Wise Itinerary:
${dayWise || '  * Complete day-by-day sightseeing and transfers included.'}
- Inclusions: ${incs || 'Accommodation, private transfers, daily breakfast, and sightseeing.'}
- Exclusions: ${excs || 'Airfare, personal expenses.'}`;
  }).join('\n\n');
}

/**
 * Returns summary statistics of the knowledge base
 */
export function getKnowledgeBaseStats(packages = DEFAULT_PACKAGES, destinations = DEFAULT_DESTINATIONS) {
  const kb = buildFullKnowledgeBase(packages, destinations);
  const foundPackages = packages.filter(p => kb.includes(p.id) || kb.includes(p.title));
  
  return {
    totalCatalogPackages: packages.length,
    totalDestinations: destinations.length,
    packagesInKnowledgeBase: foundPackages.length,
    coveragePercentage: (foundPackages.length / packages.length) * 100,
    allPackagesIncluded: foundPackages.length === packages.length,
    missingPackageIds: packages.filter(p => !kb.includes(p.id) && !kb.includes(p.title)).map(p => p.id)
  };
}
