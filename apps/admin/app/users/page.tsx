"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useUserProfiles } from "@neuro-cart/shared/hooks";
import { useOrders } from "@neuro-cart/shared/hooks";
import Button from "@neuro-cart/ui/Button";
import Input from "@neuro-cart/ui/Input";
import styles from "./page.module.css";

type UserRole = "buyer" | "seller" | "admin";
type UserStatus = "active" | "suspended" | "pending";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  orders: number;
  totalSpent: number;
}

function getRoleString(role: Record<string, unknown>): UserRole {
  if ("Admin" in role) return "admin";
  if ("Seller" in role) return "seller";
  return "buyer";
}

function getStatusString(status: Record<string, unknown>): UserStatus {
  if ("Suspended" in status) return "suspended";
  if ("Deactivated" in status) return "suspended";
  return "active";
}

export default function AdminUsersPage() {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const { userProfiles } = useUserProfiles();
  const { orders } = useOrders();

  const usersData = useMemo<UserRow[]>(() => {
    return userProfiles.map((u) => {
      const role = getRoleString(u.role as unknown as Record<string, unknown>);
      const status = getStatusString(
        u.status as unknown as Record<string, unknown>,
      );
      const userOrders = orders.filter((o) => o.userId === u.clerkId);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);

      return {
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role,
        status,
        joinedAt: new Date(
          Number(u.createdAt?.microsSinceUnixEpoch ?? 0) / 1000,
        ).toLocaleDateString(),
        orders: userOrders.length,
        totalSpent,
      };
    });
  }, [userProfiles, orders]);

  const filteredData = useMemo(() => {
    if (roleFilter === "all") return usersData;
    return usersData.filter((u) => u.role === roleFilter);
  }, [usersData, roleFilter]);

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
            variant="ghost"
            size="small"
          >
            {tc("account")} <ArrowUpDown size={14} />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className={styles.userName}>{row.original.name}</p>
            <p className={styles.userEmail}>{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue<UserRole>();
          const cls =
            role === "admin"
              ? styles.roleAdmin
              : role === "seller"
                ? styles.roleSeller
                : styles.roleBuyer;
          return <span className={`${styles.roleBadge} ${cls}`}>{role}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const s = getValue<UserStatus>();
          const cls =
            s === "active"
              ? styles.statusActive
              : s === "suspended"
                ? styles.statusSuspended
                : styles.statusPending;
          return <span className={`${styles.statusBadge} ${cls}`}>{s}</span>;
        },
      },
      { accessorKey: "joinedAt", header: tc("loading") },
      {
        accessorKey: "orders",
        header: ({ column }) => (
          <Button
            className={styles.sortBtn}
            onClick={() => column.toggleSorting()}
            type="button"
            variant="ghost"
            size="small"
          >
            {tc("loading")} <ArrowUpDown size={14} />
          </Button>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: tc("loading"),
        cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <Button
            className={styles.actionBtn}
            aria-label={tc("view")}
            variant="ghost"
            size="small"
          >
            <MoreHorizontal size={18} />
          </Button>
        ),
      },
    ],
    [tc],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <Input
            placeholder={tc("search")}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            fullWidth
          />
        </div>
        <div
          className={styles.roleFilters}
          role="group"
          aria-label={tc("search")}
        >
          {(["all", "buyer", "seller", "admin"] as const).map((r) => (
            <Button
              key={r}
              className={`${styles.filterBtn} ${roleFilter === r ? styles.filterBtnActive : ""}`}
              onClick={() => setRoleFilter(r)}
              variant="secondary"
              size="small"
            >
              {r === "all" ? tc("search") : r}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label={t("title")}>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className={styles.th}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          {tc("loading")} {table.getState().pagination.pageIndex + 1}{" "}
          {tc("loading")} {table.getPageCount()}
        </span>
        <div className={styles.pageButtons}>
          <Button
            className={styles.pageBtn}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={tc("loading")}
            variant="secondary"
            size="small"
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            className={styles.pageBtn}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={tc("loading")}
            variant="secondary"
            size="small"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </main>
  );
}
