import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(ROOT_DIR, 'server', 'data');
const BACKUP_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'packages.json');
const TRAVEL_DATA_FILE = path.resolve(ROOT_DIR, 'src', 'data', 'travelData.js');

// Mutex queue to prevent race conditions during concurrent writes
let writeQueue = Promise.resolve();

// Ensure required directories exist
function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Load default packages from src/data/travelData.js
 */
async function loadCodePackages() {
  try {
    const travelDataModule = await import(`file://${TRAVEL_DATA_FILE}?t=${Date.now()}`);
    return {
      packages: Array.isArray(travelDataModule.PACKAGES) ? travelDataModule.PACKAGES : [],
      destinations: Array.isArray(travelDataModule.DESTINATIONS) ? travelDataModule.DESTINATIONS : []
    };
  } catch (err) {
    console.error('[DB] Failed to load code packages from travelData.js:', err.message);
    return { packages: [], destinations: [] };
  }
}

/**
 * Create a timestamped backup of the current database file
 */
async function createBackup(data) {
  try {
    ensureDirectories();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.resolve(BACKUP_DIR, `packages-${timestamp}.json`);
    await fs.promises.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf8');

    // Retain only last 20 backups to save disk space
    const files = await fs.promises.readdir(BACKUP_DIR);
    const jsonFiles = files.filter(f => f.startsWith('packages-') && f.endsWith('.json')).sort();
    if (jsonFiles.length > 20) {
      for (let i = 0; i < jsonFiles.length - 20; i++) {
        await fs.promises.unlink(path.resolve(BACKUP_DIR, jsonFiles[i])).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[DB] Backup creation warning:', err.message);
  }
}

/**
 * Atomic file write with temporary file + rename to guarantee zero file corruption
 */
async function atomicWrite(filePath, data) {
  ensureDirectories();
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
  const content = JSON.stringify(data, null, 2);
  
  await fs.promises.writeFile(tempPath, content, 'utf8');
  await fs.promises.rename(tempPath, filePath);
}

/**
 * Synchronize and merge database with packages from code.
 * Preserves admin customizations while auto-adding new packages added in code.
 */
function mergePackages(existingPackages, codePackages) {
  const existingMap = new Map(existingPackages.map(p => [p.id, p]));
  const merged = [...existingPackages];

  let addedCount = 0;
  for (const codePkg of codePackages) {
    if (!existingMap.has(codePkg.id)) {
      merged.push({
        ...codePkg,
        _createdAt: new Date().toISOString(),
        _source: 'auto-synced-from-code'
      });
      existingMap.set(codePkg.id, codePkg);
      addedCount++;
    }
  }

  if (addedCount > 0) {
    console.log(`[DB] Auto-synced ${addedCount} new package(s) from code into file database.`);
  }

  return merged;
}

/**
 * Initialize the database file
 */
export async function initDatabase() {
  ensureDirectories();

  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const { packages: codePackages, destinations } = await loadCodePackages();
        let currentData = {
          version: '1.0.0',
          lastModified: new Date().toISOString(),
          destinations: destinations,
          packages: []
        };

        if (fs.existsSync(DB_FILE)) {
          try {
            const raw = await fs.promises.readFile(DB_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            const existingPackages = Array.isArray(parsed.packages) ? parsed.packages : [];
            const mergedPackages = mergePackages(existingPackages, codePackages);
            
            currentData = {
              version: parsed.version || '1.0.0',
              lastModified: new Date().toISOString(),
              destinations: parsed.destinations && parsed.destinations.length ? parsed.destinations : destinations,
              packages: mergedPackages
            };

            // Write back if packages were added
            if (mergedPackages.length !== existingPackages.length) {
              await atomicWrite(DB_FILE, currentData);
            }
          } catch (readErr) {
            console.warn('[DB] Existing DB file corrupt or unreadable, re-seeding:', readErr.message);
            currentData.packages = codePackages.map(p => ({
              ...p,
              _createdAt: new Date().toISOString()
            }));
            await atomicWrite(DB_FILE, currentData);
          }
        } else {
          // File does not exist: Seed from code
          console.log(`[DB] Seeding database with ${codePackages.length} packages from travelData.js...`);
          currentData.packages = codePackages.map(p => ({
            ...p,
            _createdAt: new Date().toISOString()
          }));
          await atomicWrite(DB_FILE, currentData);
        }

        resolve(currentData);
      } catch (err) {
        console.error('[DB] Initialization failed:', err);
        reject(err);
      }
    });
  });
}

/**
 * Get all packages and database metadata
 */
export async function getAllPackages() {
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    await initDatabase();
  }

  try {
    const raw = await fs.promises.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      packages: Array.isArray(parsed.packages) ? parsed.packages : [],
      destinations: Array.isArray(parsed.destinations) ? parsed.destinations : [],
      lastModified: parsed.lastModified || new Date().toISOString(),
      version: parsed.version || '1.0.0',
      total: Array.isArray(parsed.packages) ? parsed.packages.length : 0
    };
  } catch (err) {
    console.error('[DB] Read error:', err.message);
    const code = await loadCodePackages();
    return {
      packages: code.packages,
      destinations: code.destinations,
      lastModified: new Date().toISOString(),
      version: '1.0.0',
      total: code.packages.length
    };
  }
}

/**
 * Get a single package by ID
 */
export async function getPackageById(id) {
  const { packages } = await getAllPackages();
  return packages.find(p => p.id === id) || null;
}

/**
 * Create or save a new package
 */
export async function createPackage(newPkg) {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const dbData = await getAllPackages();
        const packages = [...dbData.packages];

        // Generate ID if not provided
        const id = newPkg.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        
        // Normalize package object
        const normalized = {
          ...newPkg,
          id,
          title: newPkg.title || 'Untitled Package',
          destinationName: newPkg.destinationName || 'Destination',
          destinationId: newPkg.destinationId || newPkg.destinationName?.toLowerCase().replace(/\s+/g, '-') || 'general',
          category: newPkg.category || 'Domestic',
          duration: newPkg.duration || '3D / 2N',
          price: newPkg.price || '₹0',
          originalPrice: newPkg.originalPrice || newPkg.price || '₹0',
          rating: String(newPkg.rating || '4.9'),
          reviewsCount: Number(newPkg.reviewsCount || 0),
          image: newPkg.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          description: newPkg.description || '',
          itinerary: Array.isArray(newPkg.itinerary) ? newPkg.itinerary : [],
          inclusions: Array.isArray(newPkg.inclusions) ? newPkg.inclusions : [],
          exclusions: Array.isArray(newPkg.exclusions) ? newPkg.exclusions : [],
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString()
        };

        // Check if ID already exists
        const existingIdx = packages.findIndex(p => p.id === id);
        if (existingIdx >= 0) {
          packages[existingIdx] = { ...packages[existingIdx], ...normalized };
        } else {
          packages.unshift(normalized);
        }

        const updatedData = {
          version: dbData.version || '1.0.0',
          lastModified: new Date().toISOString(),
          destinations: dbData.destinations,
          packages
        };

        await createBackup(updatedData);
        await atomicWrite(DB_FILE, updatedData);

        resolve(normalized);
      } catch (err) {
        console.error('[DB] Create package failed:', err);
        reject(err);
      }
    });
  });
}

/**
 * Update an existing package by ID (edit pricing, content, images, itinerary, etc.)
 */
export async function updatePackage(id, updates) {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const dbData = await getAllPackages();
        const packages = [...dbData.packages];

        const index = packages.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error(`Package with id "${id}" not found`);
        }

        const existing = packages[index];
        const updatedPackage = {
          ...existing,
          ...updates,
          id: existing.id, // Preserve immutable ID
          _updatedAt: new Date().toISOString()
        };

        packages[index] = updatedPackage;

        const updatedData = {
          version: dbData.version || '1.0.0',
          lastModified: new Date().toISOString(),
          destinations: dbData.destinations,
          packages
        };

        await createBackup(updatedData);
        await atomicWrite(DB_FILE, updatedData);

        resolve(updatedPackage);
      } catch (err) {
        console.error('[DB] Update package failed:', err);
        reject(err);
      }
    });
  });
}

/**
 * Delete a package by ID
 */
export async function deletePackage(id) {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const dbData = await getAllPackages();
        const initialCount = dbData.packages.length;
        const packages = dbData.packages.filter(p => p.id !== id);

        if (packages.length === initialCount) {
          throw new Error(`Package with id "${id}" not found`);
        }

        const updatedData = {
          version: dbData.version || '1.0.0',
          lastModified: new Date().toISOString(),
          destinations: dbData.destinations,
          packages
        };

        await createBackup(updatedData);
        await atomicWrite(DB_FILE, updatedData);

        resolve({ success: true, id, remaining: packages.length });
      } catch (err) {
        console.error('[DB] Delete package failed:', err);
        reject(err);
      }
    });
  });
}

/**
 * Explicitly synchronize database with code packages (merges any new code packages)
 */
export async function syncFromCode() {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const { packages: codePackages, destinations } = await loadCodePackages();
        const dbData = await getAllPackages();
        
        const mergedPackages = mergePackages(dbData.packages, codePackages);
        
        const updatedData = {
          version: dbData.version || '1.0.0',
          lastModified: new Date().toISOString(),
          destinations: destinations.length ? destinations : dbData.destinations,
          packages: mergedPackages
        };

        await createBackup(updatedData);
        await atomicWrite(DB_FILE, updatedData);

        resolve({
          success: true,
          totalPackages: mergedPackages.length,
          codePackagesCount: codePackages.length
        });
      } catch (err) {
        console.error('[DB] Sync from code failed:', err);
        reject(err);
      }
    });
  });
}

/**
 * Reset database to original code defaults
 */
export async function resetToDefault() {
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const { packages: codePackages, destinations } = await loadCodePackages();
        
        const resetData = {
          version: '1.0.0',
          lastModified: new Date().toISOString(),
          destinations,
          packages: codePackages.map(p => ({
            ...p,
            _resetAt: new Date().toISOString()
          }))
        };

        await createBackup(resetData);
        await atomicWrite(DB_FILE, resetData);

        resolve({
          success: true,
          packagesCount: resetData.packages.length
        });
      } catch (err) {
        console.error('[DB] Reset to default failed:', err);
        reject(err);
      }
    });
  });
}
