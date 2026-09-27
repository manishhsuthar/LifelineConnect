"use client";

// Client-side data store for the MVP. Users, donations and the current session are
// persisted to localStorage so every flow works without a backend. All reads and
// writes go through this module, so it can later be swapped for a real API.

import { useMemo, useSyncExternalStore } from 'react';
import { canReceiveFrom, sortByDateDesc } from '@/lib/blood';
import { sha256 } from '@/lib/hash';
import { createSeedData } from '@/lib/seed';
import type { BloodType, DonationRecord, User } from '@/types';

export interface StoredUser extends User {
  passwordHash: string; // Empty for seeded donors that cannot sign in
}

export interface Database {
  users: StoredUser[];
  donations: DonationRecord[];
}

interface State extends Database {
  sessionUserId: string | null;
}

const DB_KEY = 'lifeline-connect:db:v1';
const SESSION_KEY = 'lifeline-connect:session';

export class StoreError extends Error {}

let state: State | null = null;
const listeners = new Set<() => void>();

function readState(): State {
  let db: Database | null = null;
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (raw) db = JSON.parse(raw) as Database;
  } catch {
    db = null;
  }
  if (!db || !Array.isArray(db.users) || !Array.isArray(db.donations)) {
    db = createSeedData();
    try {
      window.localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      // Storage disabled: keep working in memory for this visit.
    }
  }

  let sessionUserId: string | null = null;
  try {
    sessionUserId = window.localStorage.getItem(SESSION_KEY);
  } catch {
    sessionUserId = null;
  }
  if (sessionUserId && !db.users.some((u) => u.id === sessionUserId)) {
    sessionUserId = null;
  }

  return { users: db.users, donations: db.donations, sessionUserId };
}

function getState(): State {
  if (!state) state = readState();
  return state;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: State) {
  const prev = getState();
  state = next;
  try {
    if (prev.users !== next.users || prev.donations !== next.donations) {
      window.localStorage.setItem(
        DB_KEY,
        JSON.stringify({ users: next.users, donations: next.donations })
      );
    }
    if (prev.sessionUserId !== next.sessionUserId) {
      if (next.sessionUserId) window.localStorage.setItem(SESSION_KEY, next.sessionUserId);
      else window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Storage full or disabled: the in-memory state is still updated.
  }
  emit();
}

// Keep tabs in sync when another tab logs in/out or edits data.
function handleStorage(event: StorageEvent) {
  if (event.key === null || event.key === DB_KEY || event.key === SESSION_KEY) {
    state = readState();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', handleStorage);
  };
}

function createId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function hashPassword(userId: string, password: string) {
  return sha256(`${userId}:${password}`);
}

function toPublicUser({ passwordHash: _passwordHash, ...user }: StoredUser): User {
  return user;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// ---------- Hooks ----------

/** Returns null during server render and hydration, then the stored data. */
export function useStore(): State | null {
  return useSyncExternalStore(subscribe, getState, () => null);
}

export function useSession() {
  const current = useStore();
  const user = useMemo(() => {
    if (!current?.sessionUserId) return null;
    const stored = current.users.find((u) => u.id === current.sessionUserId);
    return stored ? toPublicUser(stored) : null;
  }, [current]);
  return { ready: current !== null, user };
}

// ---------- Queries ----------

export function getUserDonations(current: Database, userId: string) {
  return sortByDateDesc(current.donations.filter((d) => d.userId === userId));
}

export interface DonorMatch {
  donor: User;
  exactMatch: boolean;
}

export function searchDonors(
  current: Database,
  { bloodType, location, excludeUserId }: { bloodType: BloodType; location: string; excludeUserId?: string }
): DonorMatch[] {
  const compatible = canReceiveFrom[bloodType];
  const query = location.trim().toLowerCase();
  return current.users
    .filter(
      (u) =>
        u.available &&
        u.id !== excludeUserId &&
        compatible.includes(u.bloodType) &&
        (!query || u.location.toLowerCase().includes(query))
    )
    .map((u) => ({ donor: toPublicUser(u), exactMatch: u.bloodType === bloodType }))
    .sort(
      (a, b) =>
        Number(b.exactMatch) - Number(a.exactMatch) || a.donor.name.localeCompare(b.donor.name)
    );
}

// ---------- Actions ----------

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  bloodType: BloodType;
  location: string;
  contactNumber?: string;
  available: boolean;
}

export function registerUser(input: RegisterInput): User {
  const current = getState();
  const email = normalizeEmail(input.email);
  if (current.users.some((u) => u.email === email)) {
    throw new StoreError('An account with this email already exists.');
  }
  const id = createId();
  const user: StoredUser = {
    id,
    name: input.name.trim(),
    email,
    bloodType: input.bloodType,
    location: input.location.trim(),
    contactNumber: input.contactNumber?.trim() || undefined,
    available: input.available,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(id, input.password),
  };
  setState({ ...current, users: [...current.users, user], sessionUserId: id });
  return toPublicUser(user);
}

export function login(email: string, password: string): User {
  const current = getState();
  const user = current.users.find((u) => u.email === normalizeEmail(email));
  if (!user || !user.passwordHash || user.passwordHash !== hashPassword(user.id, password)) {
    throw new StoreError('Incorrect email or password.');
  }
  setState({ ...current, sessionUserId: user.id });
  return toPublicUser(user);
}

export function logout() {
  setState({ ...getState(), sessionUserId: null });
}

export type ProfileUpdate = Pick<User, 'name' | 'bloodType' | 'location' | 'contactNumber' | 'available'>;

export function updateProfile(userId: string, update: ProfileUpdate) {
  const current = getState();
  setState({
    ...current,
    users: current.users.map((u) =>
      u.id === userId
        ? {
            ...u,
            name: update.name.trim(),
            bloodType: update.bloodType,
            location: update.location.trim(),
            contactNumber: update.contactNumber?.trim() || undefined,
            available: update.available,
          }
        : u
    ),
  });
}

export type DonationInput = Omit<DonationRecord, 'id' | 'userId'>;

export function addDonation(userId: string, input: DonationInput): DonationRecord {
  const current = getState();
  const donation: DonationRecord = {
    id: createId(),
    userId,
    date: input.date,
    location: input.location.trim(),
    donationType: input.donationType,
    notes: input.notes?.trim() || undefined,
  };
  setState({ ...current, donations: [...current.donations, donation] });
  return donation;
}

export function deleteDonation(userId: string, donationId: string) {
  const current = getState();
  setState({
    ...current,
    donations: current.donations.filter((d) => !(d.id === donationId && d.userId === userId)),
  });
}
