"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  useTickets,
  useUpdateTicketStatus,
  useTicketMessages,
  useAddTicketMessage,
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
  Play,
  XCircle,
  Loader2,
  ChevronRight,
  Send,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TicketHistory() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTickets(5);

  const statusMutation = useUpdateTicketStatus();
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

  const handleStatusUpdate = (
    id: string,
    newStatus: Ticket["status"],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    statusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-[var(--bg-secondary)] rounded-xl animate-pulse border border-[var(--border-light)]"
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
          Failed to load ticket history.
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
          No tickets yet
        </h3>
        <p className="text-[var(--text-secondary)]">
          Your support history will appear here once you submit a ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketItem
            key={ticket._id}
            ticket={ticket}
            isExpanded={expandedTicketId === ticket._id}
            onToggle={() => toggleExpand(ticket._id)}
            statusConfig={getStatusConfig(ticket.status)}
            onStatusUpdate={handleStatusUpdate}
            isStatusPending={
              statusMutation.isPending &&
              statusMutation.variables?.id === ticket._id
            }
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-4 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] rounded-xl font-medium hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary-300)] hover:text-[var(--primary-500)] transition-all flex items-center justify-center gap-3 group"
        >
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Load More History
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

function TicketItem({
  ticket,
  isExpanded,
  onToggle,
  statusConfig,
  onStatusUpdate,
  isStatusPending,
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
  onStatusUpdate: (
    id: string,
    status: Ticket["status"],
    e: React.MouseEvent
  ) => void;
  isStatusPending: boolean;
}) {
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(
    isExpanded ? ticket._id : null
  );
  const addMessageMutation = useAddTicketMessage();
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

    await addMessageMutation.mutateAsync({
      ticketId: ticket._id,
      message: reply,
    });
    setReply("");
  };

  return (
    <div
      className={`bg-[var(--bg-secondary)] rounded-xl border transition-all duration-300 ${
        isExpanded
          ? "border-[var(--primary-300)] shadow-lg ring-1 ring-[var(--primary-100)]"
          : "border-[var(--border-light)] hover:border-[var(--primary-200)] hover:shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-center justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
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
            className={`p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-light)] transition-colors group-hover:bg-[var(--primary-50)] ${
              isExpanded
                ? "bg-[var(--primary-500)] text-white border-[var(--primary-500)]"
                : "text-[var(--text-tertiary)]"
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
              {/* Interaction Controls */}
              <div className="flex flex-wrap items-center gap-2 py-2">
                <span className="text-[10px] uppercase font-bold text-[var(--text-tertiary)] tracking-wider mr-2">
                  Status Controls:
                </span>

                {ticket.status !== "closed" && ticket.status !== "resolved" && (
                  <button
                    disabled={isStatusPending}
                    onClick={(e) => onStatusUpdate(ticket._id, "closed", e)}
                    className="text-xs font-semibold px-3 py-1.5 bg-[var(--error-50)] text-[var(--error-600)] rounded-lg hover:bg-[var(--error-100)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <XCircle size={14} /> Close Ticket
                  </button>
                )}

                {ticket.status === "open" || ticket.status === "in_progress" ? (
                  <button
                    disabled={isStatusPending}
                    onClick={(e) => onStatusUpdate(ticket._id, "paused", e)}
                    className="text-xs font-semibold px-3 py-1.5 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-light)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Pause size={14} /> Pause
                  </button>
                ) : (
                  <button
                    disabled={isStatusPending}
                    onClick={(e) => onStatusUpdate(ticket._id, "open", e)}
                    className="text-xs font-semibold px-3 py-1.5 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-lg hover:bg-[var(--primary-100)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play size={14} /> Reopen Ticket
                  </button>
                )}

                {isStatusPending && (
                  <Loader2
                    size={16}
                    className="animate-spin text-[var(--primary-500)]"
                  />
                )}
              </div>

              {/* Threaded Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {/* Original Message */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] flex items-center justify-center shrink-0">
                    <User size={14} className="text-[var(--text-tertiary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        You
                      </span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">
                        Original message
                      </span>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-3 rounded-2xl rounded-tl-none border border-[var(--border-light)] text-sm text-[var(--text-secondary)] leading-relaxed">
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
                    <div
                      key={msg._id}
                      className={`flex items-start gap-3 ${
                        msg.senderType === "user" ? "flex-row" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          msg.senderType === "user"
                            ? "bg-[var(--bg-tertiary)] border-[var(--border-light)]"
                            : "bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] border-[var(--primary-400)] text-white"
                        }`}
                      >
                        {msg.senderType === "user" ? (
                          <User
                            size={14}
                            className="text-[var(--text-tertiary)]"
                          />
                        ) : (
                          <ShieldCheck size={14} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {msg.senderType === "user"
                              ? "You"
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
                          className={`p-3 rounded-2xl rounded-tl-none border text-sm leading-relaxed ${
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

                {/* Automation Fallback if no messages yet */}
                {!messagesLoading &&
                  (!messages || messages.length === 0) &&
                  ticket.status !== "closed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center shrink-0 shadow-sm text-white">
                        <ShieldCheck size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            BalanceIQ Support
                          </span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">
                            Instant Response
                          </span>
                        </div>
                        <div className="border border-[var(--primary-100)] p-3 rounded-2xl rounded-tl-none text-sm text-[var(--text-primary)]">
                          We&apos;ve received your request! A representative
                          will review the details and get back to you shortly.
                          You should have received a confirmation email at your
                          registered address.
                        </div>
                      </div>
                    </div>
                  )}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              {ticket.status !== "closed" && (
                <form
                  onSubmit={handleSendReply}
                  className="pt-4 border-t border-[var(--border-light)]"
                >
                  <div className="relative group">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-3 pl-4 pr-12 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all min-h-[50px] max-h-[150px] resize-none scrollbar-hide"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(e);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!reply.trim() || addMessageMutation.isPending}
                      className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
                        reply.trim() && !addMessageMutation.isPending
                          ? "bg-[var(--primary-500)] text-white shadow-md hover:bg-[var(--primary-600)]"
                          : "text-[var(--text-tertiary)]"
                      }`}
                    >
                      {addMessageMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-[var(--text-tertiary)] flex items-center gap-1 ml-1">
                    <ShieldCheck size={10} /> Shift + Enter for new line • Enter
                    to send
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
