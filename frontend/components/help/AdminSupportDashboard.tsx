"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  useAdminAllTickets,
  useAdminAddReply,
  useTicketMessages,
  Ticket,
} from "@/hooks/useTickets";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Inbox,
  Pause,
  XCircle,
  Loader2,
  ChevronRight,
  Send,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSupportDashboard() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useAdminAllTickets(10);

  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const tickets = useMemo(() => {
    return data?.pages.flatMap((page) => page.tickets) || [];
  }, [data]);

  const toggleExpand = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const getStatusConfig = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return {
          label: "Open",
          icon: Clock,
          color: "text-[var(--primary-500)]",
          bg: "bg-[var(--primary-50)]",
          border: "border-[var(--primary-100)]",
        };
      case "in_progress":
        return {
          label: "In Progress",
          icon: Loader2,
          color: "text-[var(--warning-500)]",
          bg: "bg-[var(--warning-50)]",
          border: "border-[var(--warning-100)]",
        };
      case "paused":
        return {
          label: "Paused",
          icon: Pause,
          color: "text-[var(--text-tertiary)]",
          bg: "bg-[var(--bg-tertiary)]",
          border: "border-[var(--border-light)]",
        };
      case "resolved":
        return {
          label: "Resolved",
          icon: CheckCircle2,
          color: "text-[var(--success-500)]",
          bg: "bg-[var(--success-50)]",
          border: "border-[var(--success-100)]",
        };
      case "closed":
        return {
          label: "Closed",
          icon: XCircle,
          color: "text-[var(--error-500)]",
          bg: "bg-[var(--error-50)]",
          border: "border-[var(--error-100)]",
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: "text-[var(--text-tertiary)]",
          bg: "bg-[var(--bg-tertiary)]",
          border: "border-[var(--border-light)]",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-[var(--bg-secondary)] rounded-xl animate-pulse border border-[var(--border-light)]"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-[var(--error-50)] rounded-xl border border-[var(--error-100)]">
        <AlertCircle
          className="mx-auto mb-2 text-[var(--error-500)]"
          size={32}
        />
        <p className="text-[var(--error-600)] font-medium">
          Failed to load admin support dashboard.
        </p>
        <p className="text-xs text-[var(--error-400)] mt-2">
          Make sure you have admin privileges.
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="p-12 text-center bg-[var(--bg-secondary)] rounded-xl border border-dashed border-[var(--border-light)]">
        <Inbox
          className="mx-auto mb-4 text-[var(--text-tertiary)] opacity-30"
          size={48}
        />
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          No tickets to show
        </h3>
        <p className="text-[var(--text-secondary)]">
          All quiet! No support tickets have been submitted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <ShieldCheck className="text-[var(--primary-500)]" size={20} />
          Admin Support Dashboard
        </h2>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)]">
          <div className="w-2 h-2 rounded-full bg-[var(--primary-500)] animate-pulse" />
          Live Monitoring
        </div>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <AdminTicketItem
            key={ticket._id}
            ticket={ticket}
            isExpanded={expandedTicketId === ticket._id}
            onToggle={() => toggleExpand(ticket._id)}
            statusConfig={getStatusConfig(ticket.status)}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-4 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] rounded-xl font-medium hover:bg-[var(--bg-tertiary)] transition-all flex items-center justify-center gap-3 group"
        >
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Load More Tickets
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function AdminTicketItem({
  ticket,
  isExpanded,
  onToggle,
  statusConfig,
}: {
  ticket: Ticket;
  isExpanded: boolean;
  onToggle: () => void;
  statusConfig: {
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    bg: string;
    border: string;
  };
}) {
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(
    isExpanded ? ticket._id : null
  );
  const adminReplyMutation = useAdminAddReply();
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    await adminReplyMutation.mutateAsync({
      ticketId: ticket._id,
      message: reply,
    });
    setReply("");
  };

  return (
    <div
      className={`bg-[var(--bg-secondary)] rounded-xl border transition-all duration-300 ${
        isExpanded
          ? "border-[var(--primary-400)] shadow-lg ring-1 ring-[var(--primary-100)]"
          : "border-[var(--border-light)] hover:border-[var(--primary-200)]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-center justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} flex items-center gap-1.5 shadow-sm`}
            >
              <statusConfig.icon
                size={10}
                className={
                  ticket.status === "in_progress" ? "animate-spin" : ""
                }
              />
              {statusConfig.label}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-bold flex items-center gap-1">
              USER ID: {ticket.userId.slice(-6).toUpperCase()}
            </span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium flex items-center gap-1">
              <Clock size={10} />
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary-600)] transition-colors">
            {ticket.subject}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold tracking-widest">
              {ticket.category}
            </span>
          </div>
          <div
            className={`p-1.5 rounded-lg border transition-all ${
              isExpanded
                ? "bg-[var(--primary-500)] text-white border-[var(--primary-500)]"
                : "bg-[var(--bg-tertiary)] border-[var(--border-light)] text-[var(--text-tertiary)]"
            }`}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-2 border-t border-[var(--border-light)] space-y-6">
              {/* Threaded Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 pt-4 scrollbar-thin">
                {/* Original Message */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] flex items-center justify-center shrink-0">
                    <User size={16} className="text-[var(--text-tertiary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        User
                      </span>
                      <span className="text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase font-bold">
                        Initial Request
                      </span>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-2xl rounded-tl-none border border-[var(--border-light)] text-sm text-[var(--text-secondary)] leading-relaxed">
                      {ticket.message}
                    </div>
                  </div>
                </div>

                {/* Additional Threaded Messages */}
                {messagesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2
                      size={24}
                      className="animate-spin text-[var(--primary-500)] opacity-30"
                    />
                  </div>
                ) : (
                  messages?.map((msg) => (
                    <div key={msg._id} className="flex items-start gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                          msg.senderType === "user"
                            ? "bg-[var(--bg-tertiary)] border-[var(--border-light)] shadow-sm"
                            : "bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] border-[var(--primary-400)] text-white shadow-md"
                        }`}
                      >
                        {msg.senderType === "user" ? (
                          <User
                            size={16}
                            className="text-[var(--text-tertiary)]"
                          />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`${
                              msg.senderType === "platform"
                                ? "text-[var(--primary-600)] font-black"
                                : "text-[var(--text-primary)] font-bold"
                            } text-xs`}
                          >
                            {msg.senderType === "user"
                              ? "User"
                              : "BalanceIQ Support"}
                          </span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div
                          className={`p-4 rounded-2xl rounded-tl-none border text-sm leading-relaxed shadow-sm ${
                            msg.senderType === "user"
                              ? "bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)]"
                              : "border-[var(--primary-100)] text-[var(--text-primary)]"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Admin Reply Input */}
              <form
                onSubmit={handleSendReply}
                className="pt-4 border-t border-[var(--border-light)]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-500)]">
                    Platform Response
                  </span>
                </div>
                <div className="relative group">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Provide professional assistance..."
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-4 pl-5 pr-14 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all min-h-[60px] max-h-[200px] resize-none scrollbar-hide"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!reply.trim() || adminReplyMutation.isPending}
                    className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all ${
                      reply.trim() && !adminReplyMutation.isPending
                        ? "bg-[var(--primary-500)] text-white shadow-lg hover:bg-[var(--primary-600)] transform hover:scale-105 active:scale-95"
                        : "text-[var(--text-tertiary)]"
                    }`}
                  >
                    {adminReplyMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--text-tertiary)] px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={10} /> Authenticated Support Channel
                  </span>
                  <span>Press Enter to send reply</span>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
