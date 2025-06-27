import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { map } from "lodash-es";
import { navigate } from 'astro:transitions/client';
import { useStore } from '@nanostores/react';
import { $sessions } from "@/stores/sessionsStore";
import type { SessionRecord } from "@/services/loadSessions";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SessionsTableProps {
  sessions: SessionRecord[];
  onDeleteSession: (session: SessionRecord) => void;
}

// Helper: format ms to "Xd Xh Xm Xs"
const formatDuration = (ms: number) => {
  if (ms <= 0) return "Expired";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length < 3) parts.push(`${seconds}s`); // only show seconds if not showing days, hours, and minutes

  return parts.join(' ');
};

const TimeRemaining = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return diff;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span className={cn(timeLeft <= 0 ? "text-red-500" : "text-slate-500 dark:text-slate-400")}>{formatDuration(timeLeft)}</span>;
};

const StatusBadge = ({ status }: { status: SessionRecord['status'] }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400",
    deleting: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400",
    deleted: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", statusStyles[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
};


const SessionsTable = ({ sessions, onDeleteSession }: SessionsTableProps) => {
    const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const { deviceId, isLoading } = useStore($sessions);
  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No active sessions</h3>
        <p className="mt-1 text-sm text-slate-500">Get started by creating a new session.</p>
      </div>
    )
  }

  const handleRowClick = async (sessionId: string) => {
    navigate(`/sessions/photos?eversPassDeviceId=${deviceId}&sessionId=${sessionId}`);
  };

  const formatBytesToGB = (bytes: number) => {
    if (bytes === 0) return '0.00 GB'
    const gigabytes = bytes / (1024 ** 3); // Convert bytes to gigabytes
    return `${gigabytes.toFixed(2)} GB`; // Format to 2 decimal places
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Size</TableHead>
            {isDesktop && <TableHead>Total Photos</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {map(sessions, (session) => (
            <TableRow key={session.id} onClick={() => handleRowClick(session.id)} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer">
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{session.name}</TableCell>
              <TableCell>
                <TimeRemaining expiresAt={session.expires_at} />
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{formatBytesToGB(session.total_photos_bytes)}</TableCell>
              {isDesktop && <TableCell className="text-slate-500 dark:text-slate-400">{session.total_photos}</TableCell>}
              <TableCell className="text-right">
                <Button
                  disabled={isLoading}
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session);
                  }}>
                    {/* used to be text-slate-500 maybe switch back */}
                  <Trash2 className="h-4 w-4 text-red-600 hover:text-red-600" />
                  <span className="sr-only">Delete session</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SessionsTable;
