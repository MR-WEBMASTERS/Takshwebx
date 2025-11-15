import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";
import type { Transaction } from "./types";

const TX_COLL = "transactions";

export async function addTransaction(tx: Transaction) {
  const ref = await addDoc(collection(db, TX_COLL), {
    ...tx,
    date: tx.date instanceof Date ? tx.date.toISOString() : tx.date
  });
  return { id: ref.id, ...tx };
}

export async function getAllTransactions() {
  const q = query(collection(db, TX_COLL), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
}

export function subscribeTransactions(cb: (rows: any[]) => void) {
  const q = query(collection(db, TX_COLL), orderBy("date", "desc"));
  return onSnapshot(q, snap => {
    const rows = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    cb(rows);
  });
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  await updateDoc(doc(db, TX_COLL, id), data as any);
}

export async function deleteTransaction(id: string) {
  await deleteDoc(doc(db, TX_COLL, id));
}
